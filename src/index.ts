import {
  createPrompt,
  useState,
  useKeypress,
  usePrefix,
  usePagination,
  useRef,
  useMemo,
  makeTheme,
  isUpKey,
  isDownKey,
  isSpaceKey,
  isNumberKey,
  isEnterKey,
  ValidationError,
  Separator,
  type Theme,
  type Status,
  KeypressEvent,
} from '@inquirer/core';
import type { PartialDeep, Prettify } from '@inquirer/type';
import colors from 'yoctocolors-cjs';
import figures from '@inquirer/figures';
import ansiEscapes from 'ansi-escapes';

type CheckboxTheme = {
  icon: {
    checked: string;
    unchecked: string;
    cursor: string;
  };
  style: {
    disabledChoice: (text: string) => string;
    renderSelectedChoices: <T>(
      selectedChoices: ReadonlyArray<NormalizedChoice<T>>,
      allChoices: ReadonlyArray<NormalizedChoice<T> | Separator>,
    ) => string;
    description: (text: string) => string;
  };
  helpMode: 'always' | 'never' | 'auto';
};

const checkboxTheme: CheckboxTheme = {
  icon: {
    checked: colors.green(figures.circleFilled),
    unchecked: figures.circle,
    cursor: figures.pointer,
  },
  style: {
    disabledChoice: (text: string) => colors.dim(`- ${text}`),
    renderSelectedChoices: (selectedChoices) =>
      selectedChoices.map((choice) => choice.short).join(', '),
    description: (text: string) => colors.cyan(text),
  },
  helpMode: 'auto',
};

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  short?: string;
  disabled?: boolean | string;
  checked?: boolean;
  type?: never;
};

type NormalizedChoice<Value> = {
  value: Value;
  name: string;
  description?: string;
  short: string;
  disabled: boolean | string;
  checked: boolean;
};

type CheckboxConfig<
  Value,
  ChoicesObject =
    | ReadonlyArray<string | Separator>
    | ReadonlyArray<Choice<Value> | Separator>,
> = {
  message: string;
  prefix?: string;
  pageSize?: number;
  instructions?: string | boolean;
  choices: ChoicesObject extends ReadonlyArray<string | Separator>
    ? ChoicesObject
    : ReadonlyArray<Choice<Value> | Separator>;
  loop?: boolean;
  required?: boolean;
  validate?: (
    choices: ReadonlyArray<Choice<Value>>,
  ) => boolean | string | Promise<string | boolean>;
  theme?: PartialDeep<Theme<CheckboxTheme>>;
};

type Item<Value> = NormalizedChoice<Value> | Separator;

function isSelectable<Value>(item: Item<Value>): item is NormalizedChoice<Value> {
  return !Separator.isSeparator(item) && !item.disabled;
}

function isChecked<Value>(item: Item<Value>): item is NormalizedChoice<Value> {
  return isSelectable(item) && Boolean(item.checked);
}

function toggle<Value>(item: Item<Value>): Item<Value> {
  return isSelectable(item) ? { ...item, checked: !item.checked } : item;
}

function check(checked: boolean) {
  return function <Value>(item: Item<Value>): Item<Value> {
    return isSelectable(item) ? { ...item, checked } : item;
  };
}

function normalizeChoices<Value>(
  choices: ReadonlyArray<string | Separator> | ReadonlyArray<Choice<Value> | Separator>,
): Item<Value>[] {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice)) return choice;

    if (typeof choice === 'string') {
      return {
        value: choice as Value,
        name: choice,
        short: choice,
        disabled: false,
        checked: false,
      };
    }

    const name = choice.name ?? String(choice.value);
    return {
      value: choice.value,
      name,
      short: choice.short ?? name,
      description: choice.description,
      disabled: choice.disabled ?? false,
      checked: choice.checked ?? false,
    };
  });
}

/* function createAddToDebugMsg(debugMsgRef: { current: string }) {
  return (newMsg: string, newLine = false) => {
    const separator = newLine ? "\n" : ", ";
    debugMsgRef.current = debugMsgRef.current
      ? `${debugMsgRef.current}${separator}<${newMsg}>`
      : `<${newMsg}>`;
  };
} */

interface KeyEvent {
  sequence: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  name: string;
  code: string;
}

const isLeftKey = (key: KeyEvent): boolean =>
  // The left arrow
  key.name === 'left' ||
  // Vim keybinding
  key.name === 'h';

const isRightKey = (key: KeyEvent): boolean =>
  // The right arrow
  key.name === 'right' ||
  // Vim keybinding
  key.name === 'l';

const isUpOrLeftKey = (key: KeyEvent): boolean => isUpKey(key) || isLeftKey(key);

const isDownOrRightKey = (key: KeyEvent): boolean => isDownKey(key) || isRightKey(key);

const isVerticalKey = (key: KeyEvent): boolean => isUpKey(key) || isDownKey(key);

const isHorizontalKey = (key: KeyEvent): boolean => isLeftKey(key) || isRightKey(key);

const isMoveCommandKey = (key: KeyEvent): boolean => key.name === 'm';

const isTopKey = (key: KeyEvent): boolean => key.name === 'pageup' || key.name === 't';

const isBottomKey = (key: KeyEvent): boolean =>
  key.name === 'pagedown' || key.name === 'b';

const isTopOrBottomKey = (key: KeyEvent): boolean => isTopKey(key) || isBottomKey(key);

function getTopmostSelectable<Value>(items: readonly Item<Value>[]) {
  let index = -1;
  do {
    index = (index + 1 + items.length) % items.length;
  } while (!isSelectable(items[index]!));
  return index;
}

function getBottommostSelectable<Value>(items: readonly Item<Value>[]) {
  let index = items.length;
  do {
    index = (index - 1 + items.length) % items.length;
  } while (!isSelectable(items[index]!));
  return index;
}

function getNext<Value>(
  key: KeyEvent,
  itemIndex: number,
  items: readonly Item<Value>[],
  dragging = false,
) {
  if ((isTopKey(key) || isBottomKey(key)) && dragging) {
    return isTopKey(key) ? 0 : items.length - 1;
  }
  if ((isTopKey(key) || isBottomKey(key)) && !dragging) {
    return isTopKey(key) ? getTopmostSelectable(items) : getBottommostSelectable(items);
  }

  const offset = isUpOrLeftKey(key) ? -1 : 1;

  if (dragging) {
    return (itemIndex + offset + items.length) % items.length;
  }

  let next = itemIndex;
  do {
    next = (next + offset + items.length) % items.length;
  } while (!isSelectable(items[next]!));
  return next;
}

function areConsecutive(indices: number[]) {
  return indices.every((value: number, index: number, array: number[]) => {
    return array[index - 1] === undefined ? true : value - array[index - 1]! === 1;
  });
}

function getCheckedItems<Value>(items: readonly Item<Value>[]) {
  const indices: number[] = [];
  const checkedItems = items.filter((item, i) => {
    const checked = isChecked(item);
    if (checked) {
      indices.push(i);
    }
    return checked;
  });
  return {
    checkedItems,
    indices,
    consecutive: areConsecutive(indices),
  };
}

function getUncheckedItems<Value>(items: readonly Item<Value>[]) {
  const uncheckedIndices: number[] = [];
  const uncheckedItems = items.filter((item, i) => {
    const unchecked = !isChecked(item);
    if (unchecked) {
      uncheckedIndices.push(i);
    }
    return unchecked;
  });
  return { uncheckedItems, uncheckedIndices };
}

function getActiveOffset<Value>(
  key: KeyEvent,
  items: readonly Item<Value>[],
  activeItem: Item<Value>,
) {
  let index: number | null = items.indexOf(activeItem);
  index = index >= 0 ? index : null;
  if (isUpOrLeftKey(key)) {
    return index;
  }
  return index === null ? index : index - items.length + 1;
}

// active offset is relative to direction where item is being moved
function invertActiveOffset(offset: number | null, numberOfItems: number, up: boolean) {
  let newOffset = offset;
  if (offset !== null) {
    newOffset = up ? offset - numberOfItems + 1 : offset + (numberOfItems - 1);
  }
  return newOffset;
}

function moveUpFromUpperBound<Value>(
  items: readonly Item<Value>[],
  numberOfMovingItems: number,
  movingItems: readonly Item<Value>[],
  activeOffset: number | null,
) {
  const newItems = [...items.slice(numberOfMovingItems), ...movingItems];
  const newActiveOffset = invertActiveOffset(activeOffset, numberOfMovingItems, true);
  return { newItems, activeOffset: newActiveOffset };
}

function moveDownFromLowerBound<Value>(
  items: readonly Item<Value>[],
  numberOfMovingItems: number,
  movingItems: readonly Item<Value>[],
  activeOffset: number | null,
) {
  const newItems = [
    ...movingItems,
    ...items.slice(0, items.length - numberOfMovingItems),
  ];
  const newActiveOffset = invertActiveOffset(activeOffset, numberOfMovingItems, false);
  return { newItems, activeOffset: newActiveOffset };
}

function moveInTheMiddle<Value>(
  key: KeyEvent,
  next: number,
  items: readonly Item<Value>[],
  movingItems: readonly Item<Value>[],
) {
  const before = isUpOrLeftKey(key)
    ? items.slice(0, next)
    : items.slice(0, next - movingItems.length);
  const after = isUpOrLeftKey(key)
    ? items.slice(next + movingItems.length + 1)
    : items.slice(next + 1);
  const replacedItem = items[next]!;
  return isUpOrLeftKey(key)
    ? [...before, ...movingItems, replacedItem, ...after]
    : [...before, replacedItem, ...movingItems, ...after];
}

function moveItems<Value>(
  key: KeyEvent,
  active: number,
  setActive: (newValue: number) => void,
  items: readonly Item<Value>[],
  setItems: (newValue: readonly Item<Value>[]) => void,
) {
  const currentActive = active;
  const activeItem = items[currentActive]!;

  const { checkedItems, indices, consecutive } = getCheckedItems(items);
  let numberOfMovingItems = 1;
  let activeOffset: number | null = null;
  if (
    (isUpKey(key) || isDownKey(key)) &&
    isChecked(activeItem) &&
    checkedItems.length > 1
  ) {
    numberOfMovingItems = checkedItems.length;
    activeOffset = getActiveOffset(key, checkedItems, activeItem);
  }
  const topmostChecked = indices[0]!;
  const bottommostChecked = indices.at(-1)!;
  let next = getNext(key, active, items, true);
  let newItems: Item<Value>[] = [];

  // move consecutive selected items, single selected item or active unselected item
  if (
    !isMoveCommandKey(key) &&
    ((isChecked(activeItem) && consecutive && !isTopOrBottomKey(key)) ||
      (isChecked(activeItem) && !consecutive && isHorizontalKey(key)) ||
      (!isChecked(activeItem) && !isTopOrBottomKey(key)) ||
      (checkedItems.length === 0 && !isTopOrBottomKey(key)))
  ) {
    const movingItems = numberOfMovingItems > 1 ? checkedItems : [activeItem];
    let leading = active;
    if (numberOfMovingItems > 1) {
      next = isUpOrLeftKey(key)
        ? getNext(key, topmostChecked, items, true)
        : getNext(key, bottommostChecked, items, true);
      leading = isUpOrLeftKey(key) ? topmostChecked : bottommostChecked;
    }
    if (isUpOrLeftKey(key) && leading === 0) {
      ({ newItems, activeOffset } = moveUpFromUpperBound(
        items,
        numberOfMovingItems,
        movingItems,
        activeOffset,
      ));
    } else if (isDownOrRightKey(key) && leading === items.length - 1) {
      ({ newItems, activeOffset } = moveDownFromLowerBound(
        items,
        numberOfMovingItems,
        movingItems,
        activeOffset,
      ));
    } else {
      newItems = moveInTheMiddle(key, next, items, movingItems);
    }
    const newActive = activeOffset ? next + activeOffset : next;
    setActive(newActive);
    setItems(newItems);
  }

  // place selected items with m key
  else if (isMoveCommandKey(key)) {
    const { uncheckedIndices } = getUncheckedItems(items);
    const beforeIndices = new Set(uncheckedIndices.filter((index) => index < active));
    const beforeItems = items.filter((_, i) => beforeIndices.has(i));
    const afterIndices = new Set(uncheckedIndices.filter((index) => index >= active));
    const afterItems = items.filter((_, i) => afterIndices.has(i));
    newItems = [...beforeItems, ...checkedItems, ...afterItems];
    setItems(newItems);
    const newActive = newItems.indexOf(checkedItems[0]!);
    setActive(newActive);
  }

  // move nonconsecutive selected items with up or down keys
  else if (!consecutive && isVerticalKey(key) && isChecked(activeItem)) {
    next = isUpKey(key) ? topmostChecked : bottommostChecked;
    const { uncheckedIndices } = getUncheckedItems(items);
    const beforeIndices = new Set(uncheckedIndices.filter((index) => index < next));
    const beforeItems = items.filter((_, i) => beforeIndices.has(i));
    const afterIndices = new Set(uncheckedIndices.filter((index) => index > next));
    const afterItems = items.filter((_, i) => afterIndices.has(i));
    newItems = [...beforeItems, ...checkedItems, ...afterItems];
    const newActive = newItems.indexOf(activeItem);
    setItems(newItems);
    setActive(newActive);
  }

  // move to top or bottom with top and bottom keys
  else if (isTopOrBottomKey(key)) {
    let newActive = active;
    if (isChecked(activeItem)) {
      const { uncheckedItems } = getUncheckedItems(items);
      newItems = isTopKey(key)
        ? [...checkedItems, ...uncheckedItems]
        : [...uncheckedItems, ...checkedItems];
      newActive = newItems.indexOf(activeItem);
    } else {
      newItems = isTopKey(key)
        ? [activeItem, ...items.filter((item) => item !== activeItem)]
        : [...items.filter((item) => item !== activeItem), activeItem];
      newActive = isTopKey(key) ? 0 : items.length - 1;
    }
    setItems(newItems);
    setActive(newActive);
  }
}

async function keyHandler<Value>(
  keypressEvent: KeypressEvent,
  items: readonly Item<Value>[],
  setItems: (newValue: readonly Item<Value>[]) => void,
  validate: (
    choices: readonly Choice<Value>[],
  ) => boolean | string | Promise<string | boolean>,
  required: CheckboxConfig<Value>['required'],
  setError: (newValue?: string) => void,
  setStatus: (newValue: Status) => void,
  done: (value: Array<Value>) => void,
  loop: CheckboxConfig<Value>['loop'],
  active: number,
  setActive: (newValue: number) => void,
  bounds: {
    first: number;
    last: number;
  },
  setShowHelpTip: (newValue: boolean) => void,
) {
  const key = keypressEvent as KeyEvent;
  if (isEnterKey(key)) {
    const selection = items.filter(isChecked);
    const isValid = await validate([...selection]);
    if (required && !items.some(isChecked)) {
      setError('At least one choice must be selected');
    } else if (isValid === true) {
      setStatus('done');
      done(selection.map((choice) => choice.value));
    } else {
      setError(isValid || 'You must select a valid value');
    }
  } else if (
    isUpKey(key) ||
    isDownKey(key) ||
    isLeftKey(key) ||
    isRightKey(key) ||
    isTopKey(key) ||
    isBottomKey(key) ||
    isMoveCommandKey(key)
  ) {
    if (
      loop ||
      (isUpOrLeftKey(key) && active !== bounds.first) ||
      (isDownOrRightKey(key) && active !== bounds.last)
    ) {
      if (key.ctrl || key.meta || key.shift || isMoveCommandKey(key)) {
        moveItems(key, active, setActive, items, setItems);
      } else {
        setActive(getNext(key, active, items));
      }
    }
  } else if (isSpaceKey(key)) {
    setError(undefined);
    setShowHelpTip(false);
    setItems(items.map((choice, i) => (i === active ? toggle(choice) : choice)));
  } else if (key.name === 'a') {
    const selectAll = items.some((choice) => isSelectable(choice) && !choice.checked);
    setItems(items.map(check(selectAll)));
  } else if (key.name === 'i') {
    setItems(items.map(toggle));
  } else if (isNumberKey(key)) {
    // Adjust index to start at 1
    const position = Number(key.name) - 1;
    const item = items[position];
    if (item != null && isSelectable(item)) {
      setActive(position);
      setItems(items.map((choice, i) => (i === position ? toggle(choice) : choice)));
    }
  }
}

function renderItem<Value>(
  {
    item,
    isActive,
  }: {
    item: Item<Value>;
    index: number;
    isActive: boolean;
  },
  theme: Prettify<Theme<CheckboxTheme>>,
  descriptionRef: {
    current: string | undefined;
  },
) {
  if (Separator.isSeparator(item)) {
    return ` ${item.separator}`;
  }

  if (item.disabled) {
    const disabledLabel =
      typeof item.disabled === 'string' ? item.disabled : '(disabled)';
    return theme.style.disabledChoice(`${item.name} ${disabledLabel}`);
  }

  if (isActive) {
    descriptionRef.current = item.description;
  }

  const checkbox = item.checked ? theme.icon.checked : theme.icon.unchecked;
  const color = isActive ? theme.style.highlight : (x: string) => x;
  const cursor = isActive ? theme.icon.cursor : ' ';
  return color(`${cursor}${checkbox} ${item.name}`);
}

function getHelpTips<Value>(
  theme: Prettify<Theme<CheckboxTheme>>,
  showHelpTip: boolean,
  instructions: string | boolean | undefined,
  items: readonly Item<Value>[],
  pageSize: number,
  firstRender: {
    current: boolean;
  },
) {
  let helpTipTop = '';
  let helpTipBottom = '';
  if (
    theme.helpMode === 'always' ||
    (theme.helpMode === 'auto' &&
      showHelpTip &&
      (instructions === undefined || instructions))
  ) {
    if (typeof instructions === 'string') {
      helpTipTop = instructions;
    } else {
      const keys = [
        `${theme.style.key('space')} to select`,
        `${theme.style.key('a')} to toggle all`,
        `${theme.style.key('i')} to invert selection`,
        `${theme.style.key('pgup/t or pgdown/b')} to move cursor to top or bottom`,
        `${theme.style.key('shift + arrow up or down')} to move items`,
        `${theme.style.key('shift + arrow left or right')} to move single items`,
        `${theme.style.key('shift + pgup/t or pgdown/b')} to move items to top or bottom`,
        `${theme.style.key('m')} to move selected items to the cursor position`,
        `and ${theme.style.key('enter')} to proceed`,
      ];
      helpTipTop = ` (Press ${keys.join(', ')})`;
    }

    if (
      items.length > pageSize &&
      (theme.helpMode === 'always' || (theme.helpMode === 'auto' && firstRender.current))
    ) {
      helpTipBottom = `\n${theme.style.help('(Use arrow keys to reveal more choices)')}`;
      firstRender.current = false;
    }
  }
  return [helpTipTop, helpTipBottom];
}

function getFinalPrompt<Value>(
  items: readonly Item<Value>[],
  theme: Prettify<Theme<CheckboxTheme>>,
  prefix: string,
  message: string,
) {
  const selection = items.filter(isChecked);
  const answer = theme.style.answer(theme.style.renderSelectedChoices(selection, items));

  return `${prefix} ${message} ${answer}`;
}

function getPrompt<Value>(
  theme: Prettify<Theme<CheckboxTheme>>,
  showHelpTip: boolean,
  instructions: string | boolean | undefined,
  items: readonly Item<Value>[],
  pageSize: number,
  firstRender: {
    current: boolean;
  },
  descriptionRef: {
    current: string | undefined;
  },
  errorMsg: string | undefined,
  prefix: string,
  config: CheckboxConfig<Value>,
  status: Status,
  page: string,
  debugMsgRef: { current: string },
) {
  const message = theme.style.message(config.message, status);

  if (status === 'done') {
    return getFinalPrompt(items, theme, prefix, message);
  }

  const [helpTipTop, helpTipBottom] = getHelpTips(
    theme,
    showHelpTip,
    instructions,
    items,
    pageSize,
    firstRender,
  );

  const choiceDescription = descriptionRef.current
    ? `\n${theme.style.description(descriptionRef.current)}`
    : ``;

  let error = '';
  if (errorMsg) {
    error = `\n${theme.style.error(errorMsg)}`;
  }

  let debugOutput = '';
  if (debugMsgRef.current.length > 0) {
    debugOutput = `\n${debugMsgRef.current}`;
    debugMsgRef.current = '';
  }

  return `${prefix} ${message}${helpTipTop}\n${page}${helpTipBottom}${choiceDescription}${error}${ansiEscapes.cursorHide}${debugOutput}`;
}

/**
 * The rendering function wrapped into a createPrompt() function.
 */
export default createPrompt(
  <Value>(config: CheckboxConfig<Value>, done: (value: Array<Value>) => void) => {
    const {
      instructions,
      pageSize = 7,
      loop = true,
      required,
      validate = () => true,
    } = config;
    const theme = makeTheme<CheckboxTheme>(checkboxTheme, config.theme);
    const firstRender = useRef(true);
    const [status, setStatus] = useState<Status>('idle');
    const prefix = usePrefix({ status, theme });
    const [items, setItems] = useState<ReadonlyArray<Item<Value>>>(
      normalizeChoices(config.choices),
    );

    const bounds = useMemo(() => {
      const first = items.findIndex(isSelectable);
      const last = items.findLastIndex(isSelectable);

      if (first === -1) {
        throw new ValidationError(
          '[checkbox prompt] No selectable choices. All choices are disabled.',
        );
      }

      return { first, last };
    }, [items]);

    const [active, setActive] = useState(bounds.first);
    const [showHelpTip, setShowHelpTip] = useState(true);
    const [errorMsg, setError] = useState<string>();
    const debugMsgRef = useRef<string>('');
    /* const addToDebugMsg = createAddToDebugMsg(debugMsgRef); */

    useKeypress((key) =>
      keyHandler(
        key,
        items,
        setItems,
        validate,
        required,
        setError,
        setStatus,
        done,
        loop,
        active,
        setActive,
        bounds,
        setShowHelpTip,
      ),
    );

    const descriptionRef = useRef<string>();

    const page = usePagination({
      items,
      active,
      renderItem: (layout) => renderItem(layout, theme, descriptionRef),
      pageSize,
      loop,
    });

    return getPrompt(
      theme,
      showHelpTip,
      instructions,
      items,
      pageSize,
      firstRender,
      descriptionRef,
      errorMsg,
      prefix,
      config,
      status,
      page,
      debugMsgRef,
    );
  },
);

export { Separator } from '@inquirer/core';

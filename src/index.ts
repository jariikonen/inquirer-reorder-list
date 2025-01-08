import {
  createPrompt,
  useState,
  useKeypress,
  usePrefix,
  usePagination,
  useRef,
  useMemo,
  makeTheme,
  ValidationError,
  Separator,
  type Status,
} from '@inquirer/core';
import colors from 'yoctocolors-cjs';
import figures from '@inquirer/figures';
import { getPrompt } from './getPrompt.js';
import { CheckboxTheme, Choice, CheckboxConfig, Item } from './types.js';
import { isSelectable } from './common.js';
import { renderItem } from './renderItem.js';
import { keyHandler } from './keyHandler.js';

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

/*function createAddToDebugMsg(debugMsgRef: { current: string }) {
  return (newMsg: string, newLine = false) => {
    const separator = newLine ? '\n' : ', ';
    debugMsgRef.current = debugMsgRef.current
      ? `${debugMsgRef.current}${separator}<${newMsg}>`
      : `<${newMsg}>`;
  };
}*/

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
    const [debugMsg, setDebug] = useState<string>();
    // const addToDebugMsg = createAddToDebugMsg(debugMsgRef);

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
        setDebug,
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
      debugMsg,
    );
  },
);

export { Separator } from '@inquirer/core';

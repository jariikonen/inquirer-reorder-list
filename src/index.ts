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
  type Status,
  Separator,
} from '@inquirer/core';
import colors from 'yoctocolors-cjs';
import figures from '@inquirer/figures';
import { getPrompt } from './getPrompt.js';
import {
  ReorderListTheme,
  Choice,
  ReorderListConfig,
  NormalizedChoice,
} from './types.js';
import { renderItem } from './renderItem.js';
import { keyHandler } from './keyHandler.js';

const ReorderListTheme: ReorderListTheme = {
  icon: {
    checked: colors.green(figures.circleFilled),
    unchecked: figures.circle,
    cursor: figures.pointer,
  },
  style: {
    disabledChoice: (text: string) => colors.dim(`${text}`),
    renderNewOrder: (choices) => choices.map((choice) => choice.short).join(', '),
    description: (text: string) => colors.cyan(text),
  },
  helpMode: 'auto',
};

function normalizeChoices<Value>(
  choices: ReadonlyArray<string | Separator> | ReadonlyArray<Choice<Value> | Separator>,
): NormalizedChoice<Value>[] {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice))
      return {
        value: 'separator' as Value,
        name: choice.separator,
        short: 'separator',
        disabled: false,
        checked: false,
      };

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

/*function createAddToDebugMsg(debugMsg: string, setDebug: (newValue: string) => void) {
  return (newMsg: string, newLine = false) => {
    const separator = newLine ? '\n' : ', ';
    if (debugMsg) {
      setDebug(`${debugMsg}${separator}<${newMsg}>`);
    } else {
      setDebug(`<${newMsg}>`);
    }
  };
}*/

/**
 * The rendering function wrapped into a createPrompt() function.
 */
export default createPrompt(
  <Value>(config: ReorderListConfig<Value>, done: (value: Array<Value>) => void) => {
    const { instructions, pageSize = 7, loop = true } = config;
    const theme = makeTheme<ReorderListTheme>(ReorderListTheme, config.theme);
    const firstRender = useRef(true);
    const [status, setStatus] = useState<Status>('idle');
    const prefix = usePrefix({ status, theme });
    const [items, setItems] = useState<ReadonlyArray<NormalizedChoice<Value>>>(
      normalizeChoices(config.choices),
    );

    const bounds = useMemo(() => {
      if (items.length === 0) {
        throw new ValidationError(
          '[reorder list prompt] No choices. Choises array is empty.',
        );
      }

      const first = 0;
      const last = items.length - 1;

      return { first, last };
    }, [items]);

    const [active, setActive] = useState(bounds.first);
    const [showHelpTip, setShowHelpTip] = useState(true);
    const [errorMsg, setError] = useState<string>();
    //const [debugMsg, setDebug] = useState<string>('');
    // const addToDebug = createAddToDebugMsg(debugMsg, setDebug);

    useKeypress((key) =>
      keyHandler(
        key,
        items,
        setItems,
        setError,
        setStatus,
        done,
        loop,
        active,
        setActive,
        bounds,
        setShowHelpTip,
        //setDebug,
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
      //debugMsg,
    );
  },
);

export { Separator } from '@inquirer/core';

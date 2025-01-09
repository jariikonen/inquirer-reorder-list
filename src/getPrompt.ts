import type { Prettify } from '@inquirer/type';
import { type Theme, type Status } from '@inquirer/core';
import ansiEscapes from 'ansi-escapes';
import { CheckboxConfig, CheckboxTheme, Item } from './types.js';
import { isChecked } from './common.js';

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
        `${theme.style.key('H or ?')} help`,
        `${theme.style.key('space')} select`,
        `${theme.style.key('a')} toggle all`,
        `${theme.style.key('i')} invert selection`,
        `${theme.style.key('ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b')} move selected items`,
        `${theme.style.key('ctrl/shift/meta + left/h or right/l')} move single items`,
        `${theme.style.key('m or M')} move selected above or below cursor`,
        `${theme.style.key('enter')} proceed`,
      ];
      helpTipTop = ` (${keys.join(', ')})`;
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

/**
 * Returns the prompt string, i.e., the full output of the prompt to be rendered.
 * @param theme Inquirer theme to be used (@inquirer/core.Theme).
 * @param showHelpTip Boolean indicating whether the help tip is shown or not.
 * @param instructions Instructions from the config. Replaces the helpTipTop if
 *    set.
 * @param items Choice list items.
 * @param pageSize Number of choices rows to display at a time.
 * @param firstRender A ref object containing a boolean indicating whether this
 *    is the first render.
 * @param descriptionRef A reference to a description text displayed for active
 *    item.
 * @param errorMsg Error message to be displayed.
 * @param prefix Prefix to be displayed at the beginning of the prompt.
 * @param config Configuration object.
 * @param status Status of the prompt (@inquirer/core.Status).
 * @param page Contents of a page in a string.
 * @returns The full output of the prompt to be rendered in a string.
 */
export function getPrompt<Value>(
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

  // const debugOutput = `\n${debugMsg}`;
  /*if (debugMsgRef.current.length > 0) {
    debugOutput = `\n${debugMsgRef.current}`;
    debugMsgRef.current = '';
  }*/

  return `${prefix} ${message}${helpTipTop}\n${page}${helpTipBottom}${choiceDescription}${error}${ansiEscapes.cursorHide}`;
}

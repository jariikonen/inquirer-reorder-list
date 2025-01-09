import {
  isDownKey,
  isEnterKey,
  isNumberKey,
  isSpaceKey,
  isUpKey,
  KeypressEvent,
  Status,
} from '@inquirer/core';
import { CheckboxConfig, Item, KeyEvent } from './types.js';
import { check, isSelectable, toggle } from './common.js';
import { moveItems } from './moveItems.js';
import { getNext } from './getNext.js';

export const isHelpKey = (key: KeyEvent): boolean =>
  key.sequence === '?' || key.sequence === 'H';

export const isLeftKey = (key: KeyEvent): boolean =>
  // The left arrow
  key.name === 'left' ||
  // Vim keybinding
  key.name === 'h';

export const isRightKey = (key: KeyEvent): boolean =>
  // The right arrow
  key.name === 'right' ||
  // Vim keybinding
  key.name === 'l';

export const isUpOrLeftKey = (key: KeyEvent): boolean => isUpKey(key) || isLeftKey(key);

export const isDownOrRightKey = (key: KeyEvent): boolean =>
  isDownKey(key) || isRightKey(key);

export const isVerticalKey = (key: KeyEvent): boolean => isUpKey(key) || isDownKey(key);

export const isHorizontalKey = (key: KeyEvent): boolean =>
  isLeftKey(key) || isRightKey(key);

export const isMoveCommandKey = (key: KeyEvent): boolean => key.name === 'm';

export const isMoveAboveCommandKey = (key: KeyEvent): boolean =>
  !key.shift && key.name === 'm';

export const isMoveBelowCommandKey = (key: KeyEvent): boolean =>
  key.shift && key.name === 'm';

export const isTopKey = (key: KeyEvent): boolean =>
  key.name === 'pageup' || key.name === 't';

export const isBottomKey = (key: KeyEvent): boolean =>
  key.name === 'pagedown' || key.name === 'b';

export const isTopOrBottomKey = (key: KeyEvent): boolean =>
  isTopKey(key) || isBottomKey(key);

/**
 * Handles key press events.
 * @param keypressEvent KeypressEvent to be handled
 * @param items Choices list items.
 * @param setItems Function for setting the choice list items.
 * @param validate Function for validating the final selection to be returned.
 * @param required Boolean to indicate that at least one item must be selected.
 * @param setError Function for setting an error message.
 * @param setStatus Function for setting the status of the prompt
 *    (@inquirer/core.Status).
 * @param done Callback function to be called when the prompt is done.
 * @param loop Boolean indicating whether the choices list is looped or not.
 * @param active Index of the active item.
 * @param setActive Function to set the active item index.
 * @param bounds First and last selectable index on the choices list.
 * @param setShowHelpTip Function for setting the showHelpTip boolean.
 */
export function keyHandler<Value>(
  keypressEvent: KeypressEvent,
  items: readonly Item<Value>[],
  setItems: (newValue: readonly Item<Value>[]) => void,
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
  // cast to KeyEvent to get access to all the keys of the event
  const key = keypressEvent as KeyEvent;
  /*setDebug(
    `name: ${key.name}, code: ${key.code}, sequence: ${key.sequence}, ctrl: ${key.ctrl}, meta: ${key.meta}, shift: ${key.shift}`,
  );*/
  setShowHelpTip(false);
  if (isHelpKey(key)) {
    setShowHelpTip(true);
  } else if (isEnterKey(key)) {
    setStatus('done');
    done(items.map((choice) => choice.value));
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

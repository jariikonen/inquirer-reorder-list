import {
  isEnterKey,
  isNumberKey,
  isSpaceKey,
  KeypressEvent,
  Status,
} from '@inquirer/core';
import { ReorderListConfig, KeyEvent, NormalizedChoice } from './types.js';
import {
  check,
  doNotMove,
  isBottomKey,
  isDownOrRightKey,
  isHelpKey,
  isLoopAndVerticalOrHorizontalKey,
  isMoveCommandKey,
  isTopKey,
  isVerticalOrHorizontalKey,
  isUpOrLeftKey,
  toggle,
} from './common.js';
import { moveItems } from './moveItems.js';
import { getNext } from './getNext.js';

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
  items: readonly NormalizedChoice<Value>[],
  setItems: (newValue: readonly NormalizedChoice<Value>[]) => void,
  setError: (newValue?: string) => void,
  setStatus: (newValue: Status) => void,
  done: (value: Array<Value>) => void,
  loop: ReorderListConfig<Value>['loop'],
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
  setShowHelpTip(false);
  if (isHelpKey(key)) {
    setShowHelpTip(true);
  } else if (isEnterKey(key)) {
    setStatus('done');
    done(items.map((choice) => choice.value));
  } else if (
    isUpOrLeftKey(key) ||
    isDownOrRightKey(key) ||
    isTopKey(key) ||
    isBottomKey(key) ||
    isMoveCommandKey(key)
  ) {
    if (key.ctrl || key.meta || key.shift || isMoveCommandKey(key)) {
      moveItems(key, active, setActive, items, setItems, loop, bounds);
    } else if (
      isLoopAndVerticalOrHorizontalKey(key, loop) ||
      (isVerticalOrHorizontalKey(key) && !doNotMove(key, active, bounds, loop))
    ) {
      setActive(getNext(key, active, items));
    } else if (isTopKey(key)) {
      setActive(bounds.first);
    } else if (isBottomKey(key)) {
      setActive(bounds.last);
    }
  } else if (isSpaceKey(key)) {
    setError(undefined);
    setItems(items.map((choice, i) => (i === active ? toggle(choice) : choice)));
  } else if (key.name === 'a') {
    const selectAll = items.some((choice) => !choice.checked);
    setItems(items.map(check(selectAll)));
  } else if (key.name === 'i') {
    setItems(items.map(toggle));
  } else if (isNumberKey(key)) {
    // Adjust index to start at 1
    const position = Number(key.name) - 1;
    const item = items[position];
    if (item != null) {
      setActive(position);
      setItems(items.map((choice, i) => (i === position ? toggle(choice) : choice)));
    }
  }
}

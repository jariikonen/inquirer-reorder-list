import { isDownKey, isUpKey } from '@inquirer/core';
import { KeyEvent, NormalizedChoice } from './types.js';

export const isHelpKey = (key: KeyEvent): boolean => key.sequence === '?';

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

export function isVerticalOrHorizontalKey(key: KeyEvent) {
  return isUpOrLeftKey(key) || isDownOrRightKey(key);
}

export function isLoopAndVerticalOrHorizontalKey(
  key: KeyEvent,
  loop: boolean | undefined,
) {
  return loop && (isUpOrLeftKey(key) || isDownOrRightKey(key));
}

export const isMoving = (key: KeyEvent): boolean => key.shift === true;

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

export function doNotMove(
  key: KeyEvent,
  active: number,
  bounds: { first: number; last: number },
  loop: boolean | undefined,
) {
  return (
    !loop &&
    ((isUpOrLeftKey(key) && active === bounds.first) ||
      (isDownOrRightKey(key) && active === bounds.last))
  );
}

export function isChecked<Value>(item: NormalizedChoice<Value>) {
  return Boolean(item.checked);
}

export function toggle<Value>(item: NormalizedChoice<Value>) {
  return { ...item, checked: !item.checked };
}

export function check(checked: boolean) {
  return function <Value>(item: NormalizedChoice<Value>) {
    return { ...item, checked };
  };
}

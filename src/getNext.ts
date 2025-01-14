import { isBottomKey, isTopKey, isUpOrLeftKey } from './common.js';
import { KeyEvent, NormalizedChoice } from './types.js';

/**
 * Returns the next item on the looped choices list.
 * @param key KeyEvent to be handled.
 * @param basisIndex Index of the item used as the basis for the search.
 * @param items Choices list items.
 * @param dragging Boolean indicating whether there are items dragged along.
 * @returns The index of the next item on the looped choices list.
 */
export function getNext<Value>(
  key: KeyEvent,
  basisIndex: number,
  items: readonly NormalizedChoice<Value>[],
  dragging = false,
) {
  if ((isTopKey(key) || isBottomKey(key)) && dragging) {
    return isTopKey(key) ? 0 : items.length - 1;
  }

  const offset = isUpOrLeftKey(key) ? -1 : 1;

  if (dragging) {
    return (basisIndex + offset + items.length) % items.length;
  }

  const next = (basisIndex + offset + items.length) % items.length;
  return next;
}

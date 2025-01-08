import { isSelectable } from './common.js';
import { isBottomKey, isTopKey, isUpOrLeftKey } from './keyHandler.js';
import { Item, KeyEvent } from './types.js';

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

/**
 * Returns the next item on the looped choices list.
 * @param key KeyEvent to be handled.
 * @param basisIndex Index of the item used as the basis for the search.
 * @param items Choices list items.
 * @param dragging Boolean indicatin whether there are items dragged along.
 * @returns The index of the next item on the looped choices list.
 */
export function getNext<Value>(
  key: KeyEvent,
  basisIndex: number,
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
    return (basisIndex + offset + items.length) % items.length;
  }

  let next = basisIndex;
  do {
    next = (next + offset + items.length) % items.length;
  } while (!isSelectable(items[next]!));
  return next;
}

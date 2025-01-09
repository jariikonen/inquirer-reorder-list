import { isDownKey, isUpKey } from '@inquirer/core';
import { isChecked } from './common.js';
import {
  isDownOrRightKey,
  isHorizontalKey,
  isMoveCommandKey,
  isMoveAboveCommandKey,
  isMoveBelowCommandKey,
  isTopKey,
  isTopOrBottomKey,
  isUpOrLeftKey,
  isVerticalKey,
} from './keyHandler.js';
import { Item, KeyEvent } from './types.js';
import { getNext } from './getNext.js';

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

// active offset is relative to the direction where item is being moved
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

/**
 * Calculates new positions for the items on the choices list and the index of
 * the active item, and finally sets these values.
 * @param key KeyEvent to be handled.
 * @param active Current active item index.
 * @param setActive Function for setting the active item.
 * @param items Choices list items.
 * @param setItems Function for setting the items array.
 */
export function moveItems<Value>(
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

  // place selected items above active item with m key
  else if (isMoveAboveCommandKey(key)) {
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

  // place selected items below active item with M key
  else if (isMoveBelowCommandKey(key)) {
    const { uncheckedIndices } = getUncheckedItems(items);
    const beforeIndices = new Set(uncheckedIndices.filter((index) => index <= active));
    const beforeItems = items.filter((_, i) => beforeIndices.has(i));
    const afterIndices = new Set(uncheckedIndices.filter((index) => index > active));
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

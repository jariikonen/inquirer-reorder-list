import { isDownKey, isUpKey } from '@inquirer/core';
import {
  isChecked,
  isDownOrRightKey,
  isHorizontalKey,
  isMoveCommandKey,
  isMoveAboveCommandKey,
  isTopKey,
  isTopOrBottomKey,
  isUpOrLeftKey,
  isVerticalKey,
  doNotMove,
  isVerticalOrHorizontalKey,
  isMoving,
} from './common.js';
import { KeyEvent, NormalizedChoice } from './types.js';
import { getNext } from './getNext.js';

function areConsecutive(indices: number[]) {
  return indices.every((value: number, index: number, array: number[]) => {
    return array[index - 1] === undefined ? true : value - array[index - 1]! === 1;
  });
}

function getCheckedItems<Value>(items: readonly NormalizedChoice<Value>[]) {
  const checkedIndices: number[] = [];
  const checkedItems = items.filter((item, i) => {
    const checked = isChecked(item);
    if (checked) {
      checkedIndices.push(i);
    }
    return checked;
  });
  return {
    checkedItems,
    checkedIndices,
    consecutive: areConsecutive(checkedIndices),
  };
}

function getUncheckedItems<Value>(items: readonly NormalizedChoice<Value>[]) {
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

// activeOffset is the active item offset from the first or last selected/checked
// item depending on the direction of movement
function getActiveOffset<Value>(
  key: KeyEvent,
  checkedItems: readonly NormalizedChoice<Value>[],
  activeItem: NormalizedChoice<Value>,
) {
  const index: number = checkedItems.indexOf(activeItem);
  if (isUpOrLeftKey(key)) {
    return index;
  }
  return index === null ? index : index - checkedItems.length + 1;
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
  items: readonly NormalizedChoice<Value>[],
  numberOfMovingItems: number,
  movingItems: readonly NormalizedChoice<Value>[],
  activeOffset: number | null,
) {
  const newItems = [...items.slice(numberOfMovingItems), ...movingItems];
  const newActiveOffset = invertActiveOffset(activeOffset, numberOfMovingItems, true);
  return { newItems, activeOffset: newActiveOffset };
}

function moveDownFromLowerBound<Value>(
  items: readonly NormalizedChoice<Value>[],
  numberOfMovingItems: number,
  movingItems: readonly NormalizedChoice<Value>[],
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
  items: readonly NormalizedChoice<Value>[],
  movingItems: readonly NormalizedChoice<Value>[],
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
 * Calculates and sets new positions for the items and the active item.
 * @param key KeyEvent to be handled.
 * @param active Current active item index.
 * @param setActive Function for setting the active item.
 * @param items Choices list items.
 * @param setItems Function for setting the items array.
 * @param loop Boolean indicating whether the list is looped or not.
 * @param bounds List index boundaries.
 */
export function moveItems<Value>(
  key: KeyEvent,
  active: number,
  setActive: (newValue: number) => void,
  items: readonly NormalizedChoice<Value>[],
  setItems: (newValue: readonly NormalizedChoice<Value>[]) => void,
  loop: boolean | undefined,
  bounds: { first: number; last: number },
) {
  const currentActive = active;
  const activeItem = items[currentActive]!;

  // not looping and moving up from top or down from bottom (active item is not
  // checked)
  if (!isChecked(activeItem) && doNotMove(key, active, bounds, loop)) {
    return;
  }

  const { checkedItems, checkedIndices, consecutive } = getCheckedItems(items);
  let numberOfMovingItems = 1;
  const topmostChecked = checkedIndices[0]!;
  const bottommostChecked = checkedIndices.at(-1)!;
  let activeOffset: number | null = null;

  // moving consecutive checked items
  if (
    isMoving(key) &&
    (isUpKey(key) || isDownKey(key)) &&
    isChecked(activeItem) &&
    checkedItems.length > 1 &&
    consecutive
  ) {
    numberOfMovingItems = checkedItems.length;
    activeOffset = getActiveOffset(key, checkedItems, activeItem);

    // not looping and moving up from top or down from bottom (active item is
    // checked)
    const boundary = isUpKey(key) ? topmostChecked : bottommostChecked;
    if (doNotMove(key, boundary, bounds, loop)) {
      return;
    }
  }

  // not looping and single checked item is moving up from top or down from
  // bottom
  if (
    isChecked(activeItem) &&
    checkedItems.length === 1 &&
    isVerticalOrHorizontalKey(key) &&
    doNotMove(key, active, bounds, loop)
  ) {
    return;
  }

  let next = getNext(key, active, items, true);
  let newItems: NormalizedChoice<Value>[] = [];

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

  // place selected items above active item with m key or below active item
  // with M key
  else if (isMoveCommandKey(key)) {
    const { uncheckedIndices } = getUncheckedItems(items);
    const beforeIndices = new Set(uncheckedIndices.filter((index) => index < active));
    const beforeItems = items.filter((_, i) => beforeIndices.has(i));
    const afterIndices = new Set(uncheckedIndices.filter((index) => index > active));
    const afterItems = items.filter((_, i) => afterIndices.has(i));
    const checkedItemsWithoutActive = checkedItems.filter((item) => item !== activeItem);
    newItems = isMoveAboveCommandKey(key)
      ? [...beforeItems, ...checkedItemsWithoutActive, activeItem, ...afterItems]
      : [...beforeItems, activeItem, ...checkedItemsWithoutActive, ...afterItems];
    setItems(newItems);
    const newActive = newItems.indexOf(activeItem);
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

import { Item, NormalizedChoice } from './types.js';

export function isSelectable<Value>(item: Item<Value>): item is NormalizedChoice<Value> {
  return item ? true : false;
}

export function isChecked<Value>(item: Item<Value>): item is NormalizedChoice<Value> {
  return isSelectable(item) && Boolean(item.checked);
}

export function toggle<Value>(item: Item<Value>): Item<Value> {
  return { ...item, checked: !item.checked };
}

export function check(checked: boolean) {
  return function <Value>(item: Item<Value>): Item<Value> {
    return isSelectable(item) ? { ...item, checked } : item;
  };
}

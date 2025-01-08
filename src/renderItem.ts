import { Separator, Theme } from '@inquirer/core';
import { Prettify } from '@inquirer/type';
import { CheckboxTheme, Item } from './types.js';

/**
 * Renders a choice item styled according to the theme being used.
 * @param param0 The item and a boolean indicating whether it is active or not.
 * @param theme Inquirer theme to be used (@inquirer/core.Theme).
 * @param descriptionRef A reference to a description text displayed for active
 *    item.
 * @returns A stylized choice item string.
 */
export function renderItem<Value>(
  {
    item,
    isActive,
  }: {
    item: Item<Value>;
    index: number;
    isActive: boolean;
  },
  theme: Prettify<Theme<CheckboxTheme>>,
  descriptionRef: {
    current: string | undefined;
  },
) {
  if (Separator.isSeparator(item)) {
    return ` ${item.separator}`;
  }

  if (item.disabled) {
    const disabledLabel =
      typeof item.disabled === 'string' ? item.disabled : '(disabled)';
    return theme.style.disabledChoice(`${item.name} ${disabledLabel}`);
  }

  if (isActive) {
    descriptionRef.current = item.description;
  }

  const checkbox = item.checked ? theme.icon.checked : theme.icon.unchecked;
  const color = isActive ? theme.style.highlight : (x: string) => x;
  const cursor = isActive ? theme.icon.cursor : ' ';
  return color(`${cursor}${checkbox} ${item.name}`);
}

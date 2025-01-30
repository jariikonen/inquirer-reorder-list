import { Separator, Theme } from '@inquirer/core';
import type { PartialDeep } from '@inquirer/type';

export type ReorderListTheme = {
  icon: {
    checked: string;
    unchecked: string;
    cursor: string;
  };
  style: {
    disabledChoice: (text: string) => string;
    renderNewOrder: <T>(choices: ReadonlyArray<NormalizedChoice<T>>) => string;
    description: (text: string) => string;
  };
  helpMode: 'always' | 'never' | 'auto';
};

export type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  short?: string;
  disabled?: boolean | string;
  checked?: boolean;
  type?: never;
};

export type NormalizedChoice<Value> = {
  value: Value;
  name: string;
  description?: string;
  short: string;
  disabled: boolean | string;
  checked: boolean;
};

export type ReorderListConfig<
  Value,
  ChoicesObject =
    | ReadonlyArray<string | Separator>
    | ReadonlyArray<Choice<Value> | Separator>,
> = {
  message: string;
  prefix?: string;
  pageSize?: number;
  instructions?: string | boolean;
  header?: string;
  choices: ChoicesObject extends ReadonlyArray<string | Separator>
    ? ChoicesObject
    : ReadonlyArray<Choice<Value> | Separator>;
  loop?: boolean;
  theme?: PartialDeep<Theme<ReorderListTheme>>;
};

export interface KeyEvent {
  sequence: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  name: string;
  code: string;
}

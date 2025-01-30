# inquirer-reorder-list

Simple interactive command line prompt that allows you to reorder a list of items. Made with Inquirer.js and based on @inquirer/checkbox.

## Installation

```sh
npm install inquirer-reorder-list
```

## Usage

```js
import reorderListPrompt, { Separator } from './index.js';

const answer = await reorderListPrompt({
  message: 'Arrange list items',
  pageSize: 7,
  loop: false,
  choices: [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
    new Separator(),
    { name: '4', value: '4' },
    new Separator(),
    { name: '5', value: '5', disabled: true },
    { name: '6', value: '6' },
    { name: '7', value: '7' },
  ],
});
```

## Options

| Property | Type                    | Required | Description                                                                                                                                 |
| -------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| message  | `string`                | yes      | The question to ask.                                                                                                                        |
| choices  | `Choice[]`              | yes      | List of the available choices.                                                                                                              |
| header   | `string`                | no       | The header text to display.                                                                                                                 |
| pageSize | `number`                | no       | By default, lists of choice longer than 7 will be paginated. Use this option to control how many choices will appear on the screen at once. |
| loop     | `boolean`               | no       | Defaults to `true`. When set to `false`, the cursor will be constrained to the top and bottom of the choice list without looping.           |
| theme    | [See Theming](#Theming) | no       | Customize look of the prompt.                                                                                                               |

`Separator` objects can be used in the `choices` array to render separating lines in the choice list. By default it'll render a line, but you can provide the text as argument (`new Separator('-- Dependencies --')`). This option is often used to add labels to groups within long list of options.

Because the idea of this prompt is to allow reordering of the list items, separators and disabled items can be selected to be moved.

### `Choice` object

The `Choice` object is typed as

```ts
type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  short?: string;
  checked?: boolean;
  disabled?: boolean | string;
};
```

Here's each property:

- `value`: The value is what will be returned by `await checkbox()`.
- `name`: This is the string displayed in the choice list.
- `description`: Option for a longer description string that'll appear under the list when the cursor highlight a given choice.
- `short`: Once the prompt is done (press enter), `short` can be used, if defined, in the message rendered next to the question. By default we'll use `name`. However, currently no message is rendered.
- `checked`: If `true`, the option will be checked by default.
- `disabled`: Styles the item as a disabled item. If `disabled` is a string, it'll be used as a help tip explaining why the choice isn't available.

Also note the `choices` array can contain `Separator`s to help organize long lists.

`choices` can also be an array of string, in which case the string will be used both as the `value` and the `name`.

## Theming

You can theme a prompt by passing a `theme` object option. The theme object only needs to include the keys you wish to modify, we'll fallback on the defaults for the rest.

```ts
type Theme = {
  prefix: string | { idle: string; done: string };
  spinner: {
    interval: number;
    frames: string[];
  };
  style: {
    answer: (text: string) => string;
    message: (text: string, status: 'idle' | 'done' | 'loading') => string;
    error: (text: string) => string;
    defaultAnswer: (text: string) => string;
    help: (text: string) => string;
    highlight: (text: string) => string;
    key: (text: string) => string;
    disabledChoice: (text: string) => string;
    description: (text: string) => string;
    renderSelectedChoices: <T>(
      selectedChoices: ReadonlyArray<Choice<T>>,
      allChoices: ReadonlyArray<Choice<T> | Separator>,
    ) => string;
  };
  icon: {
    checked: string;
    unchecked: string;
    cursor: string;
  };
  helpMode: 'always' | 'never' | 'auto';
};
```

### `theme.helpMode`

- `auto` (default): Hide the help tips after an interaction occurs. The scroll tip will hide after any interactions, the selection tip will hide as soon as a first selection is done.
- `always`: The help tips will always show and never hide.
- `never`: The help tips will never show.

# License

Licensed under the MIT license.

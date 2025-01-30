import { describe, it, expect } from 'vitest';
import { render } from '@inquirer/testing';
import { ValidationError } from '@inquirer/core';
import reorderList, { Separator } from './src/index.js';

const numberedChoicesLong = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 },
  { value: 10 },
  { value: 11 },
  { value: 12 },
];

const numberedChoicesShort = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];

const originalOrderLong = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const originalOrderShort = [1, 2, 3, 4];

const moveDown = { name: 'down', shift: true };
const moveUp = { name: 'up', shift: true };
const moveSingleItemDown = { name: 'right', shift: true };
const moveSingleItemUp = { name: 'left', shift: true };

describe('reorder list prompt', () => {
  describe('page size', () => {
    it('shows correct amount of items when the window size is smaller than the length of the list', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderLong);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('shows all list items when the page size is big enough', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 12,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
         ◯ 12"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderLong);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving cursor when looping is true', () => {
    it('move cursor down with arrow down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor down with arrow right (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('right');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor down with j (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('j');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor down with l (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('l');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with arrow up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with arrow left (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('left');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with k (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('k');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with h (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('h');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the bottom with pgdown (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('pagedown');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
        ❯◯ 12
         ◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the bottom with b (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('b');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
        ❯◯ 12
         ◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the top with pgup (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 10
         ◯ 11
         ◯ 12
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the top with t (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('t');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 10
         ◯ 11
         ◯ 12
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('scrolls to the last item when looping and pressing up on the first item', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('scrolls to the first item when looping and pressing down on the last item', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving cursor when looping is false', () => {
    it('move cursor down with arrow down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor down with arrow right (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('right');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor down with j (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('j');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor down with l (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('l');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with arrow up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
        `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with arrow left (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('left');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with k (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('k');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move cursor up with h (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('h');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the bottom with pgdown (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('pagedown');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 6
         ◯ 7
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
        ❯◯ 12"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the bottom with b (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('b');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 6
         ◯ 7
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
        ❯◯ 12"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the top with pgup (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('moves to the top with t (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('t');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('does not scroll up beyond first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('does not scroll down beyond last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving selected items as a group when looping is true', () => {
    it('move selected items down with arrow down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'down', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 4
         ◉ 2
        ❯◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items down with j', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'j', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 4
         ◉ 2
        ❯◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items up with arrow up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'up', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◉ 2
        ❯◉ 3
         ◯ 1
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items up with k (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'k', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◉ 2
        ❯◉ 3
         ◯ 1
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the top with pageup (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 4
         ◉ 2
        ❯◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'pageup', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 2
        ❯◉ 3
         ◯ 1
         ◯ 4
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the top with t (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 4
         ◉ 2
        ❯◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 't', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 2
        ❯◉ 3
         ◯ 1
         ◯ 4
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the bottom with pagedown (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'pagedown', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 3
        ❯◉ 4
         ◯ 1
         ◯ 2
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the top bottom b (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'b', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 3
        ❯◉ 4
         ◯ 1
         ◯ 2
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items scroll to the end when looping and moving up from the top (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 1
        ❯◉ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress(moveUp);
      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 3
         ◉ 1
        ❯◉ 2
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 1, 2, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items scroll to the start when looping and moving down from the bottom (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 3
        ❯◉ 4
         ◯ 1
         ◯ 2"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 1, 2]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move above unselected active item when m is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◯ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('m');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 4
         ◉ 1
         ◉ 2
        ❯◯ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move below unselected active item when M is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◯ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress({ name: 'm', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◯ 3
         ◯ 4
        ❯◯ 5
         ◉ 1
         ◉ 2
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 5, 1, 2, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move above selected active item when m is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◉ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('m');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 4
         ◉ 1
         ◉ 2
        ❯◉ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move below selected active item when M is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◉ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress({ name: 'm', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◯ 3
         ◯ 4
        ❯◉ 5
         ◉ 1
         ◉ 2
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 5, 1, 2, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('non-consecutive selected items group correctly when one of them is moved down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 3
         ◉ 4
         ◯ 5
        ❯◉ 6
         ◯ 7
         ◯ 8
         ◯ 9"
      `);

      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 1
         ◉ 3
         ◉ 4
        ❯◉ 6
         ◯ 7
         ◯ 8
         ◯ 9"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 5, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('non-consecutive selected items group correctly when one of them is moved up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 3
         ◉ 4
         ◯ 5
        ❯◉ 6
         ◯ 7
         ◯ 8
         ◯ 9"
      `);

      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 1
         ◉ 3
         ◉ 4
        ❯◉ 6
         ◯ 2
         ◯ 5
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 3, 4, 6, 2, 5, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving selected items as a group when looping is false', () => {
    it('move selected items down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 4
         ◉ 2
        ❯◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
        ❯◉ 3
         ◯ 1
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the top with pageup (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 4
         ◉ 2
        ❯◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'pageup', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
        ❯◉ 3
         ◯ 1
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the top with t (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 4
         ◉ 2
        ❯◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 't', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
        ❯◉ 3
         ◯ 1
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the bottom with pagedown (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'pagedown', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
         ◯ 12
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move selected items to the top bottom b (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'b', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
         ◯ 12
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items do not scroll up beyond first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 1
        ❯◉ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress(moveUp);
      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 1
        ❯◉ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items do not scroll down beyond last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress(moveDown);
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move above unselected active item when m is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◯ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('m');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 4
         ◉ 1
         ◉ 2
        ❯◯ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move below unselected active item when M is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◯ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress({ name: 'm', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 3
         ◯ 4
        ❯◯ 5
         ◉ 1
         ◉ 2
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 5, 1, 2, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move above selected active item when m is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◉ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('m');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 4
         ◉ 1
         ◉ 2
        ❯◉ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('selected items move below selected active item when M is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◯ 3
         ◯ 4
        ❯◉ 5
         ◯ 6
         ◯ 7
         ◯ 8"
      `);

      events.keypress({ name: 'm', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 3
         ◯ 4
        ❯◉ 5
         ◉ 1
         ◉ 2
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 5, 1, 2, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('non-consecutive selected items group correctly when one of them is moved down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 3
         ◉ 4
         ◯ 5
        ❯◉ 6
         ◯ 7
         ◯ 8
         ◯ 9"
      `);

      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 1
         ◉ 3
         ◉ 4
        ❯◉ 6
         ◯ 7
         ◯ 8
         ◯ 9"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 5, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('non-consecutive selected items group correctly when one of them is moved up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 3
         ◉ 4
         ◯ 5
        ❯◉ 6
         ◯ 7
         ◯ 8
         ◯ 9"
      `);

      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 1
         ◉ 3
         ◉ 4
        ❯◉ 6
         ◯ 2
         ◯ 5
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 3, 4, 6, 2, 5, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving single unselected items when looping is true', () => {
    it('move single unselected item down with arrow down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress({ name: 'down', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress({ name: 'down', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◉ 2
         ◉ 3
        ❯◯ 1
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item down with arrow right (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress({ name: 'right', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item down with j (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress({ name: 'j', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item down with l (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress({ name: 'l', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with arrow up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'up', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6"
      `);

      events.keypress({ name: 'up', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
         ◯ 1
        ❯◯ 4
         ◉ 2
         ◉ 3
         ◯ 5"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with arrow left (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'left', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with k (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'k', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with h (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'h', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 12
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single unselected item scrolls to the end when looping and moving up from the top', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);

      events.keypress(moveUp);
      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◯ 12
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single unselected item scrolls to the beginning when looping and moving down from the bottom', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('pagedown');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 12
         ◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress(moveDown);
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 12
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 12, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving single unselected items when looping is false', () => {
    it('move single unselected item down with arrow down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'down', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'down', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◉ 3
        ❯◯ 1
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item down with arrow right (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'right', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item down with j (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'j', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item down with l (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('pageup');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'l', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
        ❯◯ 1
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with arrow up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'up', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'up', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 4
         ◉ 2
         ◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 4, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with arrow left (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'left', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with k (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'k', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single unselected item up with h (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'h', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
        ❯◯ 4
         ◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single unselected item does not scroll beyond the first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);

      events.keypress(moveUp);
      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single unselected item does not scroll beyond the last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('pagedown');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 6
         ◯ 7
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
        ❯◯ 12"
      `);

      events.keypress(moveDown);
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 6
         ◯ 7
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
        ❯◯ 12"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving single selected items with left and right keys when looping is true', () => {
    it('move single selected item down with arrow right (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('up');
      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
        ❯◉ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress({ name: 'right', shift: true });
      events.keypress({ name: 'right', shift: true });
      events.keypress({ name: 'right', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◉ 3
         ◯ 4
        ❯◉ 1
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 4, 1, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single selected item down with l (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('up');
      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 11
         ◯ 12
        ❯◉ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5"
      `);

      events.keypress({ name: 'l', shift: true });
      events.keypress({ name: 'l', shift: true });
      events.keypress({ name: 'l', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◉ 3
         ◯ 4
        ❯◉ 1
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 4, 1, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single selected item up with arrow left (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'left', shift: true });
      events.keypress({ name: 'left', shift: true });
      events.keypress({ name: 'left', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 10
         ◯ 11
         ◯ 12
        ❯◉ 4
         ◯ 1
         ◉ 2
         ◉ 3"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single selected item up with h (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'h', shift: true });
      events.keypress({ name: 'h', shift: true });
      events.keypress({ name: 'h', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 10
         ◯ 11
         ◯ 12
        ❯◉ 4
         ◯ 1
         ◉ 2
         ◉ 3"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single selected item scrolls to the end when looping and moving up from the top', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress(moveSingleItemUp);
      events.keypress(moveSingleItemUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 1
         ◯ 12
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single selected item scrolls to the beginning when looping and moving down from the bottom', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('pagedown');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 12
         ◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress(moveSingleItemDown);
      events.keypress(moveSingleItemDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◉ 12
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 12, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  describe('moving single selected items with left and right keys when looping is false', () => {
    it('move single selected item down with arrow right (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('up');
      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'right', shift: true });
      events.keypress({ name: 'right', shift: true });
      events.keypress({ name: 'right', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◉ 3
         ◯ 4
        ❯◉ 1
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 4, 1, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single selected item down with l (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('up');
      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 1
         ◉ 2
         ◉ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'l', shift: true });
      events.keypress({ name: 'l', shift: true });
      events.keypress({ name: 'l', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◉ 2
         ◉ 3
         ◯ 4
        ❯◉ 1
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([2, 3, 4, 1, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single selected item up with arrow left (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'left', shift: true });
      events.keypress({ name: 'left', shift: true });
      events.keypress({ name: 'left', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 4
         ◯ 1
         ◉ 2
         ◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('move single selected item up with h (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
         ◉ 2
         ◉ 3
        ❯◉ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress({ name: 'h', shift: true });
      events.keypress({ name: 'h', shift: true });
      events.keypress({ name: 'h', shift: true });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 4
         ◯ 1
         ◉ 2
         ◉ 3
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single selected item does not scroll beyond the first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress(moveSingleItemUp);
      events.keypress(moveSingleItemUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◉ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });

    it('single selected item does not scroll beyond the last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('pagedown');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 6
         ◯ 7
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
        ❯◉ 12"
      `);

      events.keypress(moveSingleItemDown);
      events.keypress(moveSingleItemDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 6
         ◯ 7
         ◯ 8
         ◯ 9
         ◯ 10
         ◯ 11
        ❯◉ 12"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
    });
  });

  it('works with string choices', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Select an option',
      choices: ['Option A', 'Option B', 'Option C'],
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select an option (<?> help, <space> select, <a> toggle all, <i> invert
      selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
      items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
      selected above or below cursor, <enter> proceed)
      ❯◯ Option A
       ◯ Option B
       ◯ Option C"
    `);

    events.keypress('down');
    events.keypress('space');
    events.keypress(moveSingleItemDown);
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select an option
       ◯ Option A
       ◯ Option C
      ❯◉ Option B"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(['Option A', 'Option C', 'Option B']);
    expect(getScreen()).toMatchInlineSnapshot(`"✔ Select an option"`);
  });

  it('separator is also selectable', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: [new Separator(), ...numberedChoicesShort],
      loop: false,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
      selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
      items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
      selected above or below cursor, <enter> proceed)
      ❯◯ ──────────────
       ◯ 1
       ◯ 2
       ◯ 3
       ◯ 4"
    `);

    events.keypress('space');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
      ❯◉ ──────────────
       ◯ 1
       ◯ 2
       ◯ 3
       ◯ 4"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(['separator', ...originalOrderShort]);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
  });

  it('use number key to select an option', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesLong,
    });

    events.keypress('4');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◯ 1
       ◯ 2
       ◯ 3
      ❯◉ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderLong);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
  });

  it('pressing any key hides the help tip', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesShort,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
      selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
      items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
      selected above or below cursor, <enter> proceed)
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4"
    `);

    events.keypress('s');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderShort);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
  });

  it.todo('pressing ? displays the help tip', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesShort,
    });

    events.keypress('down');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◯ 1
      ❯◯ 2
       ◯ 3
       ◯ 4"
    `);

    //events.keypress({ sequence: '?' }); Does not work because render does not currently support sequence in key events.
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
      selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
      items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
      selected above or below cursor, <enter> proceed)
       ◯ 1
      ❯◯ 2
       ◯ 3
       ◯ 4"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderShort);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
  });

  it('allow setting a smaller page size', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesShort,
      pageSize: 2,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
      selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
      items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
      selected above or below cursor, <enter> proceed)
      ❯◯ 1
       ◯ 2
      (Use arrow keys to reveal more choices)"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderShort);
  });

  it('allow setting a bigger page size', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesLong,
      pageSize: 10,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
      selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
      items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
      selected above or below cursor, <enter> proceed)
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4
       ◯ 5
       ◯ 6
       ◯ 7
       ◯ 8
       ◯ 9
       ◯ 10
      (Use arrow keys to reveal more choices)"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderLong);
  });

  it('allow select all', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesLong,
    });

    events.keypress('4');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◯ 1
       ◯ 2
       ◯ 3
      ❯◉ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('a');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◉ 1
       ◉ 2
       ◉ 3
      ❯◉ 4
       ◉ 5
       ◉ 6
       ◉ 7"
    `);

    events.keypress('a');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◯ 1
       ◯ 2
       ◯ 3
      ❯◯ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderLong);
  });

  it('allow deselect all', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesLong,
    });

    events.keypress('4');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◯ 1
       ◯ 2
       ◯ 3
      ❯◉ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('a');
    events.keypress('a');
    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderLong);
  });

  it('allow inverting selection', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesLong,
    });

    const unselect = [2, 4, 6, 7, 8];
    unselect.forEach((value) => {
      events.keypress(String(value));
    });
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◯ 5
       ◉ 6
       ◉ 7
      ❯◉ 8
       ◯ 9
       ◯ 10
       ◯ 11"
    `);

    events.keypress('i');
    events.keypress('down');
    events.keypress(moveDown);
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
       ◉ 1
       ◉ 3
       ◉ 5
      ❯◉ 9
       ◉ 10
       ◉ 11
       ◉ 12"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual([...unselect, 1, 3, 5, 9, 10, 11, 12]);
  });

  it('allow disabling help tip', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesShort,
      instructions: false,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderShort);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
  });

  it('allow customizing help tip', async () => {
    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Arrange list items',
      choices: numberedChoicesShort,
      instructions:
        ' (Pulse <space> para seleccionar, <a> para alternar todos, <i> para invertir selección, y <enter> para continuar)',
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Arrange list items (Pulse <space> para seleccionar, <a> para alternar todos,
      <i> para invertir selección, y <enter> para continuar)
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(originalOrderShort);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Arrange list items"');
  });

  it('throws if choices array is empty', async () => {
    const { answer } = await render(reorderList, {
      message: 'Arrange list items',
      choices: [],
    });

    await expect(answer).rejects.toThrowErrorMatchingInlineSnapshot(
      `[ValidationError: [reorder list prompt] No choices. Choises array is empty.]`,
    );
    await expect(answer).rejects.toBeInstanceOf(ValidationError);
  });

  it('shows description of the highlighted choice', async () => {
    const choices = [
      { value: 'Stark', description: 'Winter is coming' },
      { value: 'Lannister', description: 'Hear me roar' },
      { value: 'Targaryen', description: 'Fire and blood' },
    ];

    const { answer, events, getScreen } = await render(reorderList, {
      message: 'Select a family',
      choices: choices,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a family (<?> help, <space> select, <a> toggle all, <i> invert
      selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
      items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
      selected above or below cursor, <enter> proceed)
      ❯◯ Stark
       ◯ Lannister
       ◯ Targaryen
      Winter is coming"
    `);

    events.keypress('down');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a family
       ◯ Stark
      ❯◯ Lannister
       ◯ Targaryen
      Hear me roar"
    `);

    events.keypress('space');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a family
       ◯ Stark
      ❯◉ Lannister
       ◯ Targaryen
      Hear me roar"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual(['Stark', 'Lannister', 'Targaryen']);
  });

  describe('theme: icon', () => {
    it('checked/unchecked', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        theme: {
          icon: {
            checked: '√',
            unchecked: 'x',
          },
        },
      });
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯√ 1
         x 2
         x 3
         x 4"
      `);
      events.keypress('enter');
      await answer;
    });

    it('cursor', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesShort,
        theme: {
          icon: {
            cursor: '=',
          },
        },
      });
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        =◉ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);
      events.keypress('enter');
      await answer;
    });
  });

  describe('theme: helpMode', () => {
    const scrollTip = '(Use arrow keys to reveal more choices)';
    const selectTip = '<space> select';

    it('helpMode: auto', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        theme: { helpMode: 'auto' },
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);
      expect(getScreen()).toContain(scrollTip);
      expect(getScreen()).toContain(selectTip);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);
      expect(getScreen()).not.toContain(scrollTip);
      expect(getScreen()).not.toContain(selectTip);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderLong);
      expect(getScreen()).toMatchInlineSnapshot(`"✔ Arrange list items"`);
    });

    it('helpMode: always', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        theme: { helpMode: 'always' },
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);
      expect(getScreen()).toContain(scrollTip);
      expect(getScreen()).toContain(selectTip);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);
      expect(getScreen()).toContain(scrollTip);
      expect(getScreen()).toContain(selectTip);

      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
         ◯ 1
        ❯◉ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);
      expect(getScreen()).toContain(scrollTip);
      expect(getScreen()).toContain(selectTip);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderLong);
      expect(getScreen()).toMatchInlineSnapshot(`"✔ Arrange list items"`);
    });

    it('helpMode: never', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        choices: numberedChoicesLong,
        theme: { helpMode: 'never' },
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);
      expect(getScreen()).not.toContain(scrollTip);
      expect(getScreen()).not.toContain(selectTip);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);
      expect(getScreen()).not.toContain(scrollTip);
      expect(getScreen()).not.toContain(selectTip);

      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
         ◯ 1
        ❯◉ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);
      expect(getScreen()).not.toContain(scrollTip);
      expect(getScreen()).not.toContain(selectTip);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderLong);
      expect(getScreen()).toMatchInlineSnapshot(`"✔ Arrange list items"`);
    });
  });

  describe('header', () => {
    it('should display header', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Arrange list items',
        pageSize: 7,
        loop: false,
        header: 'Header',
        choices: numberedChoicesLong,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items (<?> help, <space> select, <a> toggle all, <i> invert
        selection, <ctrl/shift/meta + up/j, down/k, pgup/t or pgdown/b> move selected
        items, <ctrl/shift/meta + left/h or right/l> move single items, <m or M> move
        selected above or below cursor, <enter> proceed)
        Header
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7
        (Use arrow keys to reveal more choices)"
      `);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Arrange list items
        Header
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderLong);
      expect(getScreen()).toMatchInlineSnapshot(`"✔ Arrange list items"`);
    });
  });
});

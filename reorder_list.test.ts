import { describe, it, expect } from 'vitest';
import { render } from '@inquirer/testing';
//import { ValidationError } from '@inquirer/core';
import reorderList from './src/index.js';

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

// kursorin likuttaminen (ylös/k, alas/j, vasen/h, oikea/l, pgup/t, pgdown/b)
// alkioiden siirtäminen ryhmässä
// yksittäisten alkioiden siirtäminen
// reunat, luuppaa: pelkkä kursori, yksittäinen alkio, alkioryhmä
// reunat, ei luuppaa: pelkkä kursori, yksittäinen alkio, alkioryhmä
// m/M-komento
describe('reorder list prompt', () => {
  describe('page size', () => {
    it('shows correct amount of items when the window size is smaller than the length of the list', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('shows all list items when the page size is big enough', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 12,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving cursor when looping is true', () => {
    it('move cursor down with arrow down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor down with arrow right (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor down with j (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor down with l (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with arrow up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with arrow left (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('left');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with k (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('k');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with h (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('h');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the bottom with pgdown (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the bottom with b (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the top with pgup (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the top with t (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('scrolls to the last item when looping and pressing up on the first item', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('scrolls to the first item when looping and pressing down on the last item', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving cursor when looping is false', () => {
    it('move cursor down with arrow down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor down with arrow right (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor down with j (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor down with l (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with arrow up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('up');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
        `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with arrow left (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('left');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with k (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('k');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move cursor up with h (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
        ❯◯ 3
         ◯ 4"
      `);

      events.keypress('h');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the bottom with pgdown (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the bottom with b (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the top with pgup (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('moves to the top with t (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('does not scroll up beyond first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
        ❯◯ 1
         ◯ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('does not scroll down beyond last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('down');
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
         ◯ 3
        ❯◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(originalOrderShort);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving selected items as a group when looping is true', () => {
    it('move selected items down with arrow down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items down with j', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items up with arrow up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items up with k (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the top with pageup (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the top with t (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the bottom with pagedown (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the top bottom b (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items scroll to the end when looping and moving up from the top (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◉ 1
        ❯◉ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress(moveUp);
      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 3
         ◉ 1
        ❯◉ 2
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 1, 2, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items scroll to the start when looping and moving down from the bottom (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◉ 3
        ❯◉ 4
         ◯ 1
         ◯ 2"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([3, 4, 1, 2]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move above unselected active item when m is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move below unselected active item when M is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move above selected active item when m is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move below selected active item when M is pressed (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('non-consecutive selected items group correctly when one of them is moved down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('non-consecutive selected items group correctly when one of them is moved up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving selected items as a group when looping is false', () => {
    it('move selected items down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the top with pageup (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the top with t (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the bottom with pagedown (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move selected items to the top bottom b (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items do not scroll up beyond first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesShort,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◉ 1
        ❯◉ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress(moveUp);
      events.keypress(moveUp);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◉ 1
        ❯◉ 2
         ◯ 3
         ◯ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items do not scroll down beyond last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress(moveDown);
      events.keypress(moveDown);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
         ◯ 1
         ◯ 2
         ◉ 3
        ❯◉ 4"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual([1, 2, 3, 4]);
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move above unselected active item when m is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move below unselected active item when M is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move above selected active item when m is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('selected items move below selected active item when M is pressed (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('non-consecutive selected items group correctly when one of them is moved down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('non-consecutive selected items group correctly when one of them is moved up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving single unselected items when looping is true', () => {
    it('move single unselected item down with arrow down (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item down with arrow right (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item down with j (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item down with l (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with arrow up (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with arrow left (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with k (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with h (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single unselected item scrolls to the end when looping and moving up from the top', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single unselected item scrolls to the beginning when looping and moving down from the bottom', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('pagedown');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving single unselected items when looping is false', () => {
    it('move single unselected item down with arrow down (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item down with arrow right (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item down with j (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item down with l (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with arrow up (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with arrow left (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with k (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single unselected item up with h (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single unselected item does not scroll beyond the first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (<?> help, <space> select, <a> toggle all, <i> invert
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single unselected item does not scroll beyond the last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('pagedown');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving single selected items with left and right keys when looping is true', () => {
    it('move single selected item down with arrow right (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single selected item down with l (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single selected item up with arrow left (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single selected item up with h (loop = true)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single selected item scrolls to the end when looping and moving up from the top', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single selected item scrolls to the beginning when looping and moving down from the bottom', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: true,
      });

      events.keypress('pagedown');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  describe('moving single selected items with left and right keys when looping is false', () => {
    it('move single selected item down with arrow right (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single selected item down with l (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single selected item up with arrow left (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('move single selected item up with h (loop = false)', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
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
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single selected item does not scroll beyond the first item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });

    it('single selected item does not scroll beyond the last item when not looping', async () => {
      const { answer, events, getScreen } = await render(reorderList, {
        message: 'Select a number',
        choices: numberedChoicesLong,
        pageSize: 7,
        loop: false,
      });

      events.keypress('pagedown');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
      expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
    });
  });

  /*
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
    events.keypress(moveSingleDown);
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
      message: 'Select a number',
      choices: [new Separator(), ...numberedChoices],
      loop: false,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
       ──────────────
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4
       ◯ 5
       ◯ 6
      (Use arrow keys to reveal more choices)"
    `);

    events.keypress('up');
    events.keypress('space');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number
       ──────────────
      ❯◉ 1
       ◯ 2
       ◯ 3
       ◯ 4
       ◯ 5
       ◯ 6"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual([1]);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number 1"');
  });

  it('use number key to select an option', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
    });

    events.keypress('4');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
       ◯ 1
       ◯ 2
       ◯ 3
      ❯◉ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual([4]);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number 4"');
  });

  it('allow setting a smaller page size', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
      pageSize: 2,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
      ❯◯ 1
       ◯ 2
      (Use arrow keys to reveal more choices)"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual([]);
  });

  it('allow setting a bigger page size', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
      pageSize: 10,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
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
    await expect(answer).resolves.toEqual([]);
  });

  it('allow select all', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
    });

    events.keypress('4');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
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
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
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
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
       ◯ 1
       ◯ 2
       ◯ 3
      ❯◯ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('a');
    events.keypress('enter');
    await expect(answer).resolves.toEqual(numberedChoices.map(({ value }) => value));
  });

  it('allow deselect all', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
    });

    events.keypress('4');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
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
    await expect(answer).resolves.toEqual([]);
  });

  it('allow inverting selection', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
    });

    const unselect = [2, 4, 6, 7, 8, 11];
    unselect.forEach((value) => {
      events.keypress(String(value));
    });
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
       ◯ 5
       ◉ 6
       ◉ 7
      ❯◉ 8
       ◯ 9
       ◯ 10
       ◯ 11"
    `);

    events.keypress('i');
    events.keypress('enter');
    await expect(answer).resolves.not.toContain(unselect);
  });

  it('allow disabling help tip', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
      instructions: false,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual([]);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
  });

  it('allow customizing help tip', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
      instructions:
        ' (Pulse <space> para seleccionar, <a> para alternar todos, <i> para invertir selección, y <enter> para continuar)',
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Pulse <space> para seleccionar, <a> para alternar todos, <i>
      para invertir selección, y <enter> para continuar)
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
    await expect(answer).resolves.toEqual([]);
    expect(getScreen()).toMatchInlineSnapshot('"✔ Select a number"');
  });

  it('throws if all choices are disabled', async () => {
    const { answer } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices.map((choice) => ({ ...choice, disabled: true })),
    });

    await expect(answer).rejects.toThrowErrorMatchingInlineSnapshot(
      `[ValidationError: [checkbox prompt] No selectable choices. All choices are disabled.]`,
    );
    await expect(answer).rejects.toBeInstanceOf(ValidationError);
  });

  it('shows validation message if user did not select any choice', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
      required: true,
    });

    events.keypress('enter');
    await Promise.resolve();
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4
       ◯ 5
       ◯ 6
       ◯ 7
      > At least one choice must be selected"
    `);

    events.keypress('space');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number
      ❯◉ 1
       ◯ 2
       ◯ 3
       ◯ 4
       ◯ 5
       ◯ 6
       ◯ 7"
    `);

    events.keypress('enter');
    await expect(answer).resolves.toEqual([1]);
  });

  it('shows description of the highlighted choice', async () => {
    const choices = [
      { value: 'Stark', description: 'Winter is coming' },
      { value: 'Lannister', description: 'Hear me roar' },
      { value: 'Targaryen', description: 'Fire and blood' },
    ];

    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a family',
      choices: choices,
    });

    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a family (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
      ❯◯ Stark
       ◯ Lannister
       ◯ Targaryen
      Winter is coming"
    `);

    events.keypress('down');
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a family (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
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
    await expect(answer).resolves.toEqual(['Lannister']);
  });

  it('uses custom validation', async () => {
    const { answer, events, getScreen } = await render(checkbox, {
      message: 'Select a number',
      choices: numberedChoices,
      validate: (items: ReadonlyArray<unknown>) => {
        if (items.length !== 1) {
          return 'Please select only one choice';
        }
        return true;
      },
    });

    events.keypress('enter');
    await Promise.resolve();
    expect(getScreen()).toMatchInlineSnapshot(`
      "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
      selection, and <enter> to proceed)
      ❯◯ 1
       ◯ 2
       ◯ 3
       ◯ 4
       ◯ 5
       ◯ 6
       ◯ 7
      > Please select only one choice"
    `);

    events.keypress('space');
    events.keypress('enter');
    await expect(answer).resolves.toEqual([1]);
  });

  describe('theme: icon', () => {
    it('checked/unchecked', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select a number',
        choices: numberedChoices,
        theme: {
          icon: {
            checked: '√',
            unchecked: 'x',
          },
        },
      });
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
        ❯√ 1
         x 2
         x 3
         x 4
         x 5
         x 6
         x 7"
      `);
      events.keypress('enter');
      await answer;
    });

    it('cursor', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select a number',
        choices: numberedChoices,
        theme: {
          icon: {
            cursor: '>',
          },
        },
      });
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
        >◉ 1
         ◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);
      events.keypress('enter');
      await answer;
    });
  });

  describe('theme: style.renderSelectedChoices', () => {
    it('renderSelectedChoices', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select your favourite number.',
        choices: numberedChoices,
        theme: {
          style: {
            renderSelectedChoices: (selected: { value: number }[]) => {
              if (selected.length > 1) {
                return `You have selected ${
                  (selected[0] as { value: number }).value
                } and ${selected.length - 1} more.`;
              }
              return `You have selected ${selected
                .slice(0, 1)
                .map((c) => c.value)
                .join(', ')}.`;
            },
          },
        },
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      events.keypress('enter');

      await answer;
      expect(getScreen()).toMatchInlineSnapshot(
        '"✔ Select your favourite number. You have selected 1 and 2 more."',
      );
    });

    it('allow customizing short names after selection', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select a commit',
        choices: [
          {
            name: '2cc9e311 (HEAD -> main) Fix(inquirer): Ensure no mutation of the question',
            value: '2cc9e311',
            short: '2cc9e311',
          },
          {
            name: '3272b94a (origin/main) Fix(inquirer): Fix close method not required',
            value: '3272b94a',
            short: '3272b94a',
          },
          {
            name: 'e4e10545 Chore(dev-deps): Bump dev-deps',
            value: 'e4e10545',
            short: 'e4e10545',
          },
        ],
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a commit (Press <space> to select, <a> to toggle all, <i> to invert
        selection, and <enter> to proceed)
        ❯◯ 2cc9e311 (HEAD -> main) Fix(inquirer): Ensure no mutation of the question
         ◯ 3272b94a (origin/main) Fix(inquirer): Fix close method not required
         ◯ e4e10545 Chore(dev-deps): Bump dev-deps"
      `);

      events.keypress('space');
      events.keypress('down');
      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a commit
         ◉ 2cc9e311 (HEAD -> main) Fix(inquirer): Ensure no mutation of the question
        ❯◉ 3272b94a (origin/main) Fix(inquirer): Fix close method not required
         ◯ e4e10545 Chore(dev-deps): Bump dev-deps"
      `);

      events.keypress('enter');
      await expect(answer).resolves.toEqual(['2cc9e311', '3272b94a']);
      expect(getScreen()).toMatchInlineSnapshot(
        `"✔ Select a commit 2cc9e311, 3272b94a"`,
      );
    });

    it('using allChoices parameter', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select your favourite number.',
        choices: numberedChoices,
        theme: {
          style: {
            renderSelectedChoices: (
              selected: { value: number }[],
              all: ({ value: number } | Separator)[],
            ) => {
              return `You have selected ${selected.length} out of ${all.length} options.`;
            },
          },
        },
      });

      events.keypress('space');
      events.keypress('down');
      events.keypress('down');
      events.keypress('space');
      events.keypress('enter');

      await answer;
      expect(getScreen()).toMatchInlineSnapshot(
        '"✔ Select your favourite number. You have selected 2 out of 12 options."',
      );
    });
  });

  describe('theme: helpMode', () => {
    const scrollTip = '(Use arrow keys to reveal more choices)';
    const selectTip = 'Press <space> to select';

    it('helpMode: auto', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select a number',
        choices: numberedChoices,
        theme: { helpMode: 'auto' },
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
        selection, and <enter> to proceed)
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
        "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
        selection, and <enter> to proceed)
         ◯ 1
        ❯◯ 2
         ◯ 3
         ◯ 4
         ◯ 5
         ◯ 6
         ◯ 7"
      `);
      expect(getScreen()).not.toContain(scrollTip);
      expect(getScreen()).toContain(selectTip);

      events.keypress('space');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
      await expect(answer).resolves.toEqual([2]);
      expect(getScreen()).toMatchInlineSnapshot(`"✔ Select a number 2"`);
    });

    it('helpMode: always', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select a number',
        choices: numberedChoices,
        theme: { helpMode: 'always' },
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
        selection, and <enter> to proceed)
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
        "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
        selection, and <enter> to proceed)
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
        "? Select a number (Press <space> to select, <a> to toggle all, <i> to invert
        selection, and <enter> to proceed)
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
      await expect(answer).resolves.toEqual([2]);
      expect(getScreen()).toMatchInlineSnapshot(`"✔ Select a number 2"`);
    });

    it('helpMode: never', async () => {
      const { answer, events, getScreen } = await render(checkbox, {
        message: 'Select a number',
        choices: numberedChoices,
        theme: { helpMode: 'never' },
      });

      expect(getScreen()).toMatchInlineSnapshot(`
        "? Select a number
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
        "? Select a number
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
        "? Select a number
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
      await expect(answer).resolves.toEqual([2]);
      expect(getScreen()).toMatchInlineSnapshot(`"✔ Select a number 2"`);
    });
  });*/
});

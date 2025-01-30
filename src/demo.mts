import colors from 'yoctocolors-cjs';
import reorderListPrompt, { Separator } from './index.js';

/**
 * Demonstrates the use of the prompt.
 */
async function demo() {
  try {
    const answer = await reorderListPrompt({
      message: 'Arrange list items',
      pageSize: 7,
      loop: false,
      header: colors.bold(colors.yellow('   Ingredient          Quantity  Unit')),
      choices: [
        { name: 'Flour                  15      dl', value: 'Flour' },
        { name: 'Sugar                  2       dl', value: 'Sugar' },
        { name: 'Eggs                   1       pc', value: 'Eggs' },
        { name: 'Milk                   5       dl', value: 'Milk' },
        { name: 'Butter                 200     g', value: 'Butter' },
        { name: 'Yeast                  50      g', value: 'Yeast' },
        new Separator('------------- Extras -------------'),
        { name: 'Chocolate chips', value: 'Chocolate chips' },
        { name: 'Nuts', value: 'Nuts' },
        new Separator(),
        { name: 'Salt', value: 'Salt', disabled: true },
      ],
    });
    console.log(`Answer: ${answer.join(', ')}`);
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log('Exiting; user force closed the process.');
    } else {
      throw error;
    }
  }
}

await demo();

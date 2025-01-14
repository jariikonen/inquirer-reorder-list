import reorderList from './index.js';

/**
 * Demonstrates the use of the prompt.
 */
async function demo() {
  try {
    const answer = await reorderList({
      message: 'Arrange list items',
      loop: true,
      choices: [
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

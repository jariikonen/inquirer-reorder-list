import checkbox, { Separator } from './index.js';

async function demo() {
  const answer = await checkbox({
    message: 'You can move items with shift and arrow keys + t (top) and b (bottom)',
    pageSize: 9,
    loop: true,
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
  console.log(`Answer ${answer.join(', ')}`);
}

await demo();

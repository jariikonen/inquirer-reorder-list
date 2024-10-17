import checkbox from "./index.js";

async function demo() {
  const answer = await checkbox({
    message: "Select pet",
    choices: ["cat", "dog"],
  });
  console.log(`Answer ${answer}`);
}

demo();

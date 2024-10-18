import checkbox from "./index.js";

async function demo() {
  const answer = await checkbox({
    message: "Select pet",
    choices: [
      { value: "Stark", description: "Winter is coming" },
      { value: "Lannister", description: "Hear me roar" },
      { value: "Targaryen", description: "Fire and blood" },
    ],
  });
  console.log(`Answer ${answer}`);
}

demo();

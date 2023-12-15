import { readFileSync } from "fs";

const registerDuplicates = (
  numberOfDuplicates: number,
  startingLine: number
) => {
  for (let i = 0; i < numberOfDuplicates; i++) {
    const nextCardNumber = startingLine + i + 1;

    const currentCardCount = cardCountMap.get(`card ${startingLine}`);
    const nextCardCount = cardCountMap.get(`card ${nextCardNumber}`);

    if (currentCardCount && nextCardCount && nextCardNumber <= input.length) {
      cardCountMap.set(
        `card ${nextCardNumber}`,
        nextCardCount + 1 * currentCardCount
      );
    } else {
      continue;
    }
  }
};

// fill cardCountMap with 1 for each card
const fillCardCountMap = (map: Map<string, number>, scratchGames: string[]) => {
  for (let i = 0; i < scratchGames.length; i++) {
    map.set(`card ${i + 1}`, 1);
  }
  return map;
};

// Read the file
const inputFile = "./input.txt";
const input = readFileSync(inputFile, "utf8")
  .split("\n")
  .filter((line) => line.trim());

const cardCountMap = new Map<string, number>();

fillCardCountMap(cardCountMap, input);

let counter = 0;

for (const line of input) {
  counter++;

  let numberOfDuplicatesToCreate = 0;

  const [header, data] = line.split(":");
  console.log(`processing ${header.trim()}`);

  const [winningNumbers, gameNumbers] = data.split("|");
  const winnningNumbersArray = winningNumbers
    .trim()
    .split(" ")
    .filter((x) => !!x);
  const gameNumbersArray = gameNumbers
    .trim()
    .split(" ")
    .filter((x) => !!x);

  for (const number of winnningNumbersArray) {
    if (gameNumbersArray.includes(number)) {
      numberOfDuplicatesToCreate++;
    }
  }

  registerDuplicates(numberOfDuplicatesToCreate, counter);
}

console.log(cardCountMap);

const sum = Array.from(cardCountMap.values()).reduce((a, b) => a + b);
console.log(`The answer to part 2 is ${sum}`);

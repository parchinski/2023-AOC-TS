// Imports
import { readFileSync } from "fs";

// Main
if (process.argv[2] === undefined) {
  throw new Error("Please provide an input file");
}
const inputFile = process.argv[2];
const input = readFileSync(inputFile, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((x) => !!x);

const result = sumOfAllLines(input);

// Functions
function sumOfAllLines(input: string[]): number {
  let sum = 0;

  for (const line of input) {
    const numbers = line
      .split(" ")
      .map((x) => x.trim())
      .map((x) => parseInt(x));
    const decendingDifferences: number[][] = findDecendingDifferences(numbers);
    const nextNumber = findNextNumber(decendingDifferences, numbers);
    sum += nextNumber;
  }

  return sum;
}

function findDecendingDifferences(numbers: number[]): number[][] {
  const decendingDifferences: number[][] = [];
  let nextDifferences = findNextDifferences(numbers);

  while (!nextDifferences.every((x) => x === 0)) {
    decendingDifferences.push(nextDifferences);
    nextDifferences = findNextDifferences(nextDifferences);
  }

  return decendingDifferences;
}

function findNextDifferences(numbers: number[]): number[] {
  const differences: number[] = [];

  numbers.forEach((number, index) => {
    if (index === numbers.length - 1) {
      return;
    } else {
      const difference = numbers[index + 1] - number;
      differences.push(difference);
    }
  });

  return differences;
}

function findNextNumber(
  decendingDifferences: number[][],
  numbers: number[]
): number {
  const ascendingDifferences = decendingDifferences.reverse();
  let increment = 0;

  for (let i = 0; i < ascendingDifferences.length; i++) {
    console.log(ascendingDifferences[i]);
    if (
      ascendingDifferences[i].every((x) => x === ascendingDifferences[i][0])
    ) {
      increment = ascendingDifferences[i][0];
      return numbers[numbers.length - 1];
    }
  }

  return 0;
}

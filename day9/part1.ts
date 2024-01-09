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
console.log(`Answer to part 1: ${result}`);

// Functions
function sumOfAllLines(input: string[]): number {
  let sum = 0;

  for (const line of input) {
    const numbers = line
      .split(" ")
      .map((x) => x.trim())
      .map((x) => parseInt(x));
    const descendingDifferences: number[][] = findDescendingDifferences(
      numbers
    );
    console.log(descendingDifferences);

    const nextNumber = findNextNumber(
      descendingDifferences,
      numbers[numbers.length - 1]
    );

    sum += nextNumber;
  }

  return sum;
}

function findDescendingDifferences(numbers: number[]): number[][] {
  const decendingDifferences: number[][] = [];
  let nextDifferences = findNextDifferences(numbers);

  while (!nextDifferences.every((x) => x === 0)) {
    decendingDifferences.push(nextDifferences);
    nextDifferences = findNextDifferences(nextDifferences);
  }

  return decendingDifferences.reverse();
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
  descendingDifferences: number[][],
  numberToAddTo: number
): number {
  let nextNumber = numberToAddTo;
  console.log(nextNumber);

  for (let i = 0; i < descendingDifferences.length; i++) {
    const currentDifferences = descendingDifferences[i];
    if (i === 0) {
      nextNumber += currentDifferences[i];
    } else {
      nextNumber += currentDifferences[currentDifferences.length - 1];
    }
  }

  console.log(nextNumber);
  return nextNumber;
}

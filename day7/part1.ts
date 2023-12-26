// Imports
import { readFileSync } from "fs";

// Constants
const FILE_NAME = "example.txt";

const SORTED_SUITS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
]; // sorted highest to least value

// Functions
const sortHandsAndBids = (
  hands: string[],
  bids: number[]
) => {
  //! TODO: Sort hands and bids
};

const processInputArray = (
  input: string[]
): number => {
  let totalWinnings: number = 0;
  const hands: string[] = [];
  const bids: number[] = [];

  input.forEach((line) => {
    const [hand, bid] = line.split(" ");
    hands.push(hand);
    bids.push(parseInt(bid));
    console.log(`Hand: ${hand}, Bid: ${bid}`);
  });

  sortHandsAndBids(hands, bids);

  for (let i = 1; i < bids.length + 1; i++) {
    const value = bids[i - 1] * i;
    totalWinnings += value;
  }

  return totalWinnings;
};

const readFile = (filename: string) => {
  const input = readFileSync(filename, "utf8")
    .split("\n")
    .filter((x) => !!x)
    .map((line) => line.trim());

  const totalWinnings = processInputArray(input);
  console.log(
    `Answer to part 1 is: ${totalWinnings}`
  );
};

readFile(FILE_NAME);

import { readFileSync } from "fs";

const handToBidMap: { [key: string]: number } = {};
const handToRankingMap: { [key: string]: number } = {};

const getHandRank = (hand: string) => {
  const cards = hand.trim().split("");
  const cardCounts: { [key: string]: number } = {};

  // Count the number of each card
  for (const card of cards) {
    if (cardCounts[card]) {
      cardCounts[card] += 1;
    } else {
      cardCounts[card] = 1;
    }
  }

  if (cards.includes("J")) {
    const cardsWithoutJokers = cards.filter((card) => card !== "J");
    //! TODO
  } else {
    //! TODO
  }
};

const collectData = (filename: string) => {
  const input = readFileSync(filename, "utf8")
    .split("\n")
    .filter((x: string) => !!x)
    .map((line: string) => line.trim());

  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    const lineNumber = i + 1;
    const [hand, lineBid] = line.split(" ");
    const bid = parseInt(lineBid.trim());

    console.log(`Hand: ${hand}, Bid: ${bid} Line: ${lineNumber}`);

    // Assign this bid to this hand
    Object.defineProperty(handToBidMap, hand, {
      value: bid,
      enumerable: true,
      writable: true,
    });

    // Assign a rank to this hand
    const rank = getHandRank(hand);
  }
};

// Make sure file name is passed
if (process.argv[2] === undefined) {
  throw new Error("Please provide an input file");
}

const fileName = process.argv[2];
const answer = collectData(fileName);
console.log(`the total result for part 2 is ${answer}`);

// Imports
import { readFileSync } from "fs";

// Types
type HandValue = {
  fiveOfAKind: 0;
  fourOfAKind: 1;
  fullHouse: 2;
  threeOfAKind: 3;
  twoPair: 4;
  onePair: 5;
  highCard: 6;
};

type CombinedType = {
  hand: string;
  handValue: number;
  bid: number;
};

// Constants
const RANKED_SUITS = [
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
];

const RANKED_HANDS: HandValue = {
  fiveOfAKind: 0,
  fourOfAKind: 1,
  fullHouse: 2,
  threeOfAKind: 3,
  twoPair: 4,
  onePair: 5,
  highCard: 6,
};

const assignHandValue = (hand: string): number => {
  const handArray: string[] = [...hand];
  const currentHandCardCount: {
    [key: string]: number;
  } = {};

  let currentStatusValue: number = RANKED_HANDS.highCard;

  handArray.forEach((card) => {
    currentHandCardCount[card] =
      (currentHandCardCount[card] || 0) + 1;
  });

  const values: number[] = Object.values(currentHandCardCount);

  switch (true) {
    case values.includes(5):
      currentStatusValue = RANKED_HANDS.fiveOfAKind;
      break;
    case values.includes(4):
      currentStatusValue = RANKED_HANDS.fourOfAKind;
      break;
    case values.includes(3):
      currentStatusValue = values.includes(2)
        ? RANKED_HANDS.fullHouse
        : RANKED_HANDS.threeOfAKind;
      break;
    case values.filter((value) => value === 2).length === 2:
      currentStatusValue = RANKED_HANDS.twoPair;
      break;
    case values.includes(2):
      currentStatusValue = RANKED_HANDS.onePair;
      break;
    default:
      currentStatusValue = RANKED_HANDS.highCard;
  }

  return currentStatusValue;
};

const compareIndividualCards = (card1: string, card2: string) => {
  const firstHandCardIndex = RANKED_SUITS.indexOf(card1);
  const secondHandCardIndex = RANKED_SUITS.indexOf(card2);

  if (firstHandCardIndex > secondHandCardIndex) {
    return 1;
  } else if (firstHandCardIndex < secondHandCardIndex) {
    return -1;
  } else {
    return 0;
  }
};

const sortBasedOnHandValues = (
  hands: string[],
  handValues: number[],
  bids: number[]
): [string[], number[], number[]] => {
  // Create an array of objects
  const combined: CombinedType[] = hands.map((hand, index) => ({
    hand,
    handValue: handValues[index],
    bid: bids[index],
  }));

  // Group the hands by handValue
  const groups: { [key: number]: CombinedType[] } = {};
  combined.forEach((item) => {
    if (!groups[item.handValue]) {
      groups[item.handValue] = [];
    }
    groups[item.handValue].push(item);
  });

  // Sort each group individually
  Object.values(groups).forEach((group) => {
    group.sort((a, b) => {
      for (
        let i = 0;
        i < Math.min(a.hand.length, b.hand.length);
        i++
      ) {
        const comparison = compareIndividualCards(
          a.hand[i],
          b.hand[i]
        );
        if (comparison !== 0) {
          return comparison;
        }
      }
      return a.hand.length - b.hand.length;
    });
  });

  // Flatten the groups back into a single array
  const sortedCombined: CombinedType[] = [];
  Object.keys(groups)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((key) => {
      sortedCombined.push(...groups[Number(key)]);
    });

  // Create new arrays for hands, handValues, and bids
  const sortedHands: string[] = sortedCombined.map(
    (item) => item.hand
  );
  const sortedHandValues: number[] = sortedCombined.map(
    (item) => item.handValue
  );
  const sortedBids: number[] = sortedCombined.map((item) => item.bid);

  return [
    sortedHands.reverse(),
    sortedHandValues.reverse(),
    sortedBids.reverse(),
  ];
};

const sortHandsAndBids = (
  hands: string[],
  bids: number[]
): number[] => {
  const handValues: number[] = [];

  hands.forEach((hand, index) => {
    console.log(`Hand: ${hand}, Bid: ${bids[index]}`);
    const handValue: number = assignHandValue(hand);
    console.log(`Hand Value: ${handValue}`);
    handValues.push(handValue);
  });

  console.log(`Hand Values: ${handValues}`);

  const [sortedHands, sortedHandValues, sortedBids] =
    sortBasedOnHandValues(hands, handValues, bids);

  console.log(`Sorted Hands: ${sortedHands}`);
  console.log(`Sorted Hand Values: ${sortedHandValues}`);
  console.log(`Sorted Bids: ${sortedBids}`);

  return sortedBids;
};

const processInputArray = (input: string[]): number => {
  let totalWinnings: number = 0;
  const hands: string[] = [];
  const bids: number[] = [];

  input.forEach((line) => {
    const [hand, bid] = line.split(" ");
    hands.push(hand);
    bids.push(parseInt(bid));
  });

  const finalSortedBids: number[] = sortHandsAndBids(hands, bids);

  // check if finalSortedBids is a number array
  for (let i = 1; i <= finalSortedBids.length; i++) {
    const value = finalSortedBids[i - 1] * i;

    console.log(`${finalSortedBids[i - 1]} * ${i} = ${value}`);

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
  console.log(`Answer to part 1 is: ${totalWinnings}`);
};

if (process.argv[2] === undefined) {
  throw new Error("Please provide an input file");
}

const fileName = process.argv[2];

readFile(fileName);

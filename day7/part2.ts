import { readFileSync } from "fs";

const RANKED_SUITS = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

const handToBidMap: { [key: string]: number } = {};
const handToRankingMap: { [key: string]: number } = {};

const calculateWinnings = (hands: string[]) => {
  let total = 0;

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    const bid = handToBidMap[hand];

    total += bid * (i + 1);
  }

  return total;
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

const findBestWildcardHand = (cards: string[], jokerCount: number) => {
  const bestHand = [...cards];
  const cardCounts: { [key: string]: number } = {};

  // Count the number of each card
  for (const card of cards) {
    if (cardCounts[card]) {
      cardCounts[card] += 1;
    } else {
      cardCounts[card] = 1;
    }
  }

  // Find the highest card count
  const highestCardCount = Math.max(...Object.values(cardCounts));
  const cardsWithHighestCount = Object.keys(cardCounts).filter(
    (key) => cardCounts[key] === highestCardCount,
  );
  console.log(`Cards with highest count: ${cardsWithHighestCount}`);

  // Full house from 2 pair scenario
  if (cardsWithHighestCount.length === 2 && jokerCount === 1) {
    bestHand.push(cardsWithHighestCount[0]);
    console.log(`Full house from 2 pair scenario: ${bestHand}`);
    return bestHand;
  }

  if (highestCardCount <= 4) {
    for (let i = 0; i < jokerCount; i++) {
      bestHand.push(cardsWithHighestCount[0]);
    }
    console.log(`best hand: ${bestHand}`);
    return bestHand;
  }

  return bestHand;
};

const determineJokerlessHandRank = (cards: string[]) => {
  const cardCounts: { [key: string]: number } = {};

  // Count the number of each card
  for (const card of cards) {
    if (cardCounts[card]) {
      cardCounts[card] += 1;
    } else {
      cardCounts[card] = 1;
    }
  }

  const values = Object.values(cardCounts);

  let currentStatusValue = 0; // high card

  switch (true) {
    case values.includes(5):
      currentStatusValue = 6; // 5 of a kind
      break;
    case values.includes(4):
      currentStatusValue = 5; // 4 of a kind
      break;
    case values.includes(3):
      currentStatusValue = values.includes(2)
        ? 4 // Full house
        : 3; // 3 of a kind
      break;
    case values.filter((value) => value === 2).length === 2:
      currentStatusValue = 2; // 2 pairs
      break;
    case values.includes(2):
      currentStatusValue = 1; // 1 pair
      break;
  }

  return currentStatusValue;
};

const getHandType = (hand: string) => {
  const cards = hand.trim().split("");
  let handType = 0;

  if (cards.includes("J")) {
    const cardsWithoutJokers = cards.filter((card) => card !== "J");
    const jokerCount = cards.length - cardsWithoutJokers.length;

    const bestHand = findBestWildcardHand(cardsWithoutJokers, jokerCount);

    handType = determineJokerlessHandRank(bestHand);
  } else {
    handType = determineJokerlessHandRank(cards);
  }

  return handType;
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
      writable: false,
    });

    // Assign a rank to this hand
    const rank = getHandType(hand);

    Object.defineProperty(handToRankingMap, hand, {
      value: rank,
      enumerable: true,
      writable: false,
    });
  }

  // Sort the hands by rank first in ascending order
  const hands = [...Object.keys(handToRankingMap)];

  const handsSortedByRank = hands.sort((a, b) => {
    const rankA = handToRankingMap[a];
    const rankB = handToRankingMap[b];
    return rankA - rankB;
  });

  // Sort same rank hands by highest individual card value starting at the beginning of the array
  const handsSortedByRankAndCard = handsSortedByRank.sort((a, b) => {
    const rankA = handToRankingMap[a];
    const rankB = handToRankingMap[b];

    if (rankA === rankB) {
      const cardsA = a.split("");
      const cardsB = b.split("");

      for (let i = 0; i < cardsA.length; i++) {
        const cardA = cardsA[i];
        const cardB = cardsB[i];

        const comparison = compareIndividualCards(cardA, cardB);

        if (comparison !== 0) {
          return -comparison;
        }
      }
    }

    return 0;
  });
  console.log(`Hands sorted by rank and card: ${handsSortedByRankAndCard}`);

  // Calulate the total winnings based on rules
  const totalWinnings = calculateWinnings(handsSortedByRankAndCard);

  return totalWinnings;
};

// Make sure file name is passed
if (process.argv[2] === undefined) {
  throw new Error("Please provide an input file");
}

const fileName = process.argv[2];
const answer = collectData(fileName);
console.log(`the total result for part 2 is ${answer}`);

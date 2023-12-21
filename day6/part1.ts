// Imports
import { readFileSync } from "fs";

// Constants
const INPUT_FILE = "input.txt";

// Functions
const howManyWaysToWinForEachRound = (
  times: string[],
  distance: string[]
): number[] => {
  const waysToWin: number[] = [];

  // make sure the arrays are the same length
  if (times.length !== distance.length) {
    console.log("Times and distance arrays are not the same length");
    return [];
  }

  // convert the arrays to numbers
  const timesAsNum: number[] = times.map((time) => parseInt(time));
  const distanceAsNum: number[] = distance.map((dist) => parseInt(dist));

  for (let i = 0; i < timesAsNum.length; i++) {
    let waysToWinThisRound: number = 0;
    const raceTime: number = timesAsNum[i];
    const recordDistance: number = distanceAsNum[i];

    for (let buttonHoldTime = 0; buttonHoldTime < raceTime; buttonHoldTime++) {
      const speed: number = buttonHoldTime;
      const timeLeft: number = raceTime - buttonHoldTime;
      const distanceTraveled: number = speed * timeLeft;

      if (distanceTraveled > recordDistance) {
        waysToWinThisRound++;
      }
    }
    waysToWin.push(waysToWinThisRound);
    waysToWinThisRound = 0;
  }
  return waysToWin;
};

// Main
const input: string[] = readFileSync(INPUT_FILE, "utf8")
  .split("\n")
  .filter((line) => line.trim());

const times: string[] = input[0]
  .split(":")[1]
  .trim()
  .split(" ")
  .map((time) => time.trim())
  .filter((x) => !!x);

const distance: string[] = input[1]
  .split(":")[1]
  .trim()
  .split(" ")
  .map((time) => time.trim())
  .filter((x) => !!x);

const waysToWin: number[] = howManyWaysToWinForEachRound(times, distance);
console.log(`Array of ways to win for each round: ${waysToWin}`);

const productOfWaysToWin: number = waysToWin.reduce((a, b) => a * b);
console.log(`Answer to part 1: ${productOfWaysToWin}`);

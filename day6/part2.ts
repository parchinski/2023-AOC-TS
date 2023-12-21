// Imports
import { readFileSync } from "fs";

// Constants
const INPUT_FILE = "input.txt";

// Functions
const howManyWaysToWin = (time: string, distance: string): number => {
  const raceTime: number = parseInt(time);
  const recordDistance: number = parseInt(distance);
  let waysToWin: number = 0;

  for (let buttonHoldTime = 0; buttonHoldTime < raceTime; buttonHoldTime++) {
    const speed: number = buttonHoldTime;
    const timeLeft: number = raceTime - buttonHoldTime;
    const distanceTraveled: number = speed * timeLeft;

    if (distanceTraveled > recordDistance) {
      waysToWin++;
    }
  }
  return waysToWin;
};

// Main
const input: string[] = readFileSync(INPUT_FILE, "utf8")
  .split("\n")
  .filter((line) => line.trim());

const time: string = input[0]
  .split(":")[1]
  .trim()
  .split("")
  .map((time) => time.trim())
  .filter((x) => !!x)
  .join("");

const distance: string = input[1]
  .split(":")[1]
  .trim()
  .split("")
  .map((time) => time.trim())
  .filter((x) => !!x)
  .join("");

const waysToWin: number = howManyWaysToWin(time, distance);
console.log(`Answer to part 2: ${waysToWin}`);

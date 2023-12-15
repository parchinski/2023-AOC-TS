import { readFileSync } from "fs";

const doublePointValue = (points: number) => {
  return points + points;
};

const findLinePoints = (line: string): number => {
  let points = 0;

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
      console.log(points);

      if (points !== 0) {
        points = doublePointValue(points);
      } else {
        points++;
      }
    }
  }

  return points;
};

const readScratchFile = () => {
  const inputFile = "./input.txt";
  const input = readFileSync(inputFile, "utf8")
    .split("\n")
    .filter((line) => line.trim());

  let totalPoints: number = 0;

  for (const line of input) {
    totalPoints += findLinePoints(line);
  }

  console.log(`The answer is ${totalPoints}`);
};

readScratchFile();

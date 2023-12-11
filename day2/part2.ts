import { readFileSync } from "fs";

const findHighestRequiredColors = (games: string[]) => {
  // values to store the current highest number of cubes of each color
  let highestRed = 0;
  let highestGreen = 0;
  let highestBlue = 0;

  // for each round in the rounds array
  games.forEach((rounds) => {
    // initialize an object for each round to count the number of cubes of each color
    const cubeCounts: { [key: string]: number } = { red: 0, green: 0, blue: 0 };

    // split the rounds into each individual round
    rounds.split(";").forEach((round) => {
      // split the round into each individual cube and amount
      const cubes = round.split(",");

      // account for each cube in the round
      for (const cube of cubes) {
        const [count, color] = cube.trim().split(" ");
        cubeCounts[color as keyof typeof cubeCounts] += parseInt(count);
      }

      // check if the current round contains the highest number of cubes for a color
      for (const color in cubeCounts) {
        if (color === "red" && cubeCounts[color] > highestRed) {
          highestRed = cubeCounts[color];
        } else if (color === "green" && cubeCounts[color] > highestGreen) {
          highestGreen = cubeCounts[color];
        } else if (color === "blue" && cubeCounts[color] > highestBlue) {
          highestBlue = cubeCounts[color];
        }
      }

      // reset values of cubeCounts for the next round
      cubeCounts.red = 0;
      cubeCounts.green = 0;
      cubeCounts.blue = 0;
    });
  });
  // return the highest num of cubes for each color for the given game
  return { highestRed, highestGreen, highestBlue };
};

const processGames = (input: string[]): number[] => {
  // initialize array to hold the possible game ids
  const gamePowers: number[] = [];

  input.forEach((line) => {
    // seperate the game header from the rounds
    const [gameHeader, ...rounds] = line.split(":");

    console.log(`We are currently processing game ${gameHeader}`);

    const { highestRed, highestGreen, highestBlue } =
      findHighestRequiredColors(rounds);

    // collect the game power for this game
    const gamePower = highestRed * highestGreen * highestBlue;
    gamePowers.push(gamePower);
  });
  return gamePowers;
};

try {
  const inputFile = "./input.txt";
  const input = readFileSync(inputFile, "utf8")
    .split("\n")
    .filter((line) => line.trim());

  const gamePowers: number[] = processGames(input);

  console.log(`The powers for this game were ${gamePowers}`);
  console.log(
    `All these powers added up is ${gamePowers.reduce((a, b) => a + b)}`
  );
} catch (error) {
  console.error("Error reading the file:", error);
}

import { readFileSync } from "fs";

const MAX_CUBES: { [key: string]: number } = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseRound = (round: string): boolean => {
  // initialize an object to count the number of cubes of each color
  const cubeCounts: { [key: string]: number } = { red: 0, green: 0, blue: 0 };

  // count the number of cubes of each color
  round.split(",").forEach((cube) => {
    const [count, color] = cube.trim().split(" ");
    cubeCounts[color as keyof typeof cubeCounts] += parseInt(count);
  });

  // return true if all colors are less than or equal to there respective max
  return Object.keys(cubeCounts).every(
    (color) =>
      cubeCounts[color as keyof typeof cubeCounts] <=
      MAX_CUBES[color as keyof typeof MAX_CUBES]
  );
};

const processGames = (input: string[]): number[] => {
  // initialize array to hold the possible game ids
  const possibleGames: number[] = [];

  input.forEach((line) => {
    // split the line into the game id and the rounds
    const [gameHeader, ...rounds] = line.split(":");

    // get the gameId of the line
    const gameId = parseInt(gameHeader.split(" ")[1]);

    // check if the game is possible by checking each round of the game
    const isGamePossible = rounds.join(";").split(";").every(parseRound);

    // if the game is possible, add the gameId to the possibleGames array
    if (isGamePossible) {
      possibleGames.push(gameId);
    }
  });
  return possibleGames;
};

try {
  // input file
  const inputFile = "./input.txt";

  // read the input file and trim the lines
  const input = readFileSync(inputFile, "utf8")
    .split("\n")
    .filter((line) => line.trim());

  // start the main loop passing the input array to the processGames function
  const possibleGames: number[] = processGames(input);

  // log the output
  console.log(`Possible Games = ${possibleGames}`);
  console.log(
    `Sum of Game IDs: ${possibleGames.reduce((sum, id) => sum + id, 0)}`
  );
} catch (error) {
  console.error("Error reading the file:", error);
}

import { readFileSync } from "fs";

// a gear ratio is the product of the two numbers touching the symbol
const findGearRatio = (grid: string[][], row: number, col: number) => {
  const numbers: number[] = [];

  // loop through 3 rows
  for (let di = -1; di <= 1; di++) {
    // loop through 3 columns
    for (let dj = -1; dj <= 1; dj++) {
      // skip the gear symbol itself
      if (di === 0 && dj === 0) continue;

      // define the next coords to check
      const ni = row + di,
        nj = col + dj;

      // check if coords valid
      if (ni >= 0 && ni < grid.length && nj >= 0 && nj < grid[ni].length) {
        // collect the character
        const char = grid[ni][nj];

        if (/\d/.test(char)) {
          // Find the start of the number
          let startIndex = nj;
          while (startIndex > 0 && /\d/.test(grid[ni][startIndex - 1]))
            startIndex--;

          // Find the end of the number
          let endIndex = nj;
          while (endIndex < grid[ni].length && /\d/.test(grid[ni][endIndex]))
            endIndex++;

          // slice from the indices and join to make a string
          const numberString = grid[ni].slice(startIndex, endIndex).join("");
          const number = parseInt(numberString, 10);

          // Avoid adding the same number twice
          if (!numbers.includes(number)) {
            numbers.push(number);
          }
        }
      }
    }
  }

  // Expecting exactly two numbers for a valid gear ratio
  return numbers.length === 2 ? numbers[0] * numbers[1] : 0;
};

const main = () => {
  try {
    // input setup
    const inputFile = "./input.txt";
    const input = readFileSync(inputFile, "utf8")
      .split("\n")
      .map((line) => line.split(""));

    let totalOfGearRatios: number = 0;

    // loop through each line in the input
    for (let i = 0; i < input.length; i++) {
      // loop through each character in the line
      for (let j = 0; j < input[i].length; j++) {
        const char = input[i][j];

        if (char === "*") {
          // Check specifically for gears
          const touchingNumberProduct = findGearRatio(input, i, j);

          // if not 0, add to total
          if (touchingNumberProduct > 0) {
            totalOfGearRatios += touchingNumberProduct;
          }
        }
      }
    }
    console.log(`Answer for part 2: ${totalOfGearRatios}`);
  } catch (err) {
    console.error(err);
  }
};

main();

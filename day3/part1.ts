import { readFileSync } from "fs";

const SPECIAL_CHARACTERS = "/\\=():;,<>[]{}?!@#$%^&*_-+~`|\"'".split("");

// Function which handles the logic for checking if a character is a special character
function isSpecialCharacter(char: string) {
  return SPECIAL_CHARACTERS.includes(char);
}

// Function which handles the logic for checking if a cell is adjacent to a special character
function isAdjacentToSpecialCharacter(
  grid: string[][],
  row: number,
  col: number
) {
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di === 0 && dj === 0) continue;
      const ni = row + di,
        nj = col + dj;
      if (ni >= 0 && ni < grid.length && nj >= 0 && nj < grid[ni].length) {
        if (isSpecialCharacter(grid[ni][nj])) {
          return true;
        }
      }
    }
  }
  return false;
}
// main
const main = () => {
  try {
    const inputFile = "./input.txt";
    const input = readFileSync(inputFile, "utf8")
      .split("\n")
      .map((line) => line.split(""));

    let sum = 0;
    const processedNumbers = new Set();

    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
        const char = input[i][j];
        if (/\d/.test(char) && isAdjacentToSpecialCharacter(input, i, j)) {
          let startIndex = j;
          while (startIndex > 0 && /\d/.test(input[i][startIndex - 1]))
            startIndex--;
          let endIndex = j;
          while (endIndex < input[i].length && /\d/.test(input[i][endIndex]))
            endIndex++;

          const numberString = input[i].slice(startIndex, endIndex).join("");
          const numberPosition = `${i},${startIndex}`;
          if (!processedNumbers.has(numberPosition)) {
            sum += parseInt(numberString, 10);
            processedNumbers.add(numberPosition);
          }
        }
      }
    }

    console.log(`Sum of all part numbers: ${sum}`);
  } catch (err) {
    console.error(err);
  }
};

main();

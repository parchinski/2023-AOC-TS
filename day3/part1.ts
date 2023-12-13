import { readFileSync } from "fs";

const SPECIAL_CHARACTERS = "/\\=():;,<>[]{}?!@#$%^&*_-+~`|\"'".split("");

// Function which handles the logic for checking if a character is a special character
function isSpecialCharacter(char: string) {
  return SPECIAL_CHARACTERS.includes(char);
}

// Function which handles the logic for checking if a cell is adjacent to a special character

// main
const main = () => {
  try {
    const inputFile = "./sample-input.txt";
    const input = readFileSync(inputFile, "utf8")
      .split("\n")
      .map((line) => line.split(""));

    // store processed numbers and a value for the sum
    const processedNumbers = new Set();
    let sum = 0;

    // loop through each line in the input
    for (let i = 0; i < input.length; i++) {
      // loop through each character in the line
      for (let j = 0; j < input[i].length; j++) {
        const char = input[i][j];

        // If the character is a digit and is adjacent to a special character
        if (isSpecialCharacter(char)) {
          // start at the current char
          let startIndex = j;

          // increment backwards until the start of the number is found
          while (startIndex > 0 && /\d/.test(input[i][startIndex - 1]))
            startIndex--;

          // start at the current char
          let endIndex = j;

          // increment forwards until the end of the number is found
          while (endIndex < input[i].length && /\d/.test(input[i][endIndex]))
            endIndex++;

          // slice the number from the input using the start and end indices
          const numberString = input[i].slice(startIndex, endIndex).join("");

          // keep track of the line and the starting index of the number processed
          const numberPosition = `${i},${startIndex}`;

          // if the number has not been processed, add it to the sum and mark it as processed
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

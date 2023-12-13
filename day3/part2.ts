import { readFileSync } from "fs";

const SPECIAL_CHARACTERS = "/\\=():;,<>[]{}?!@#$%^&*_-+~`|\"'".split("");

const isSpecialCharacter = (char: string) => {
  return SPECIAL_CHARACTERS.includes(char);
};

const main = () => {
  try {
    // input setup
    const inputFile = "./sample-input.txt";
    const input = readFileSync(inputFile, "utf8")
      .split("\n")
      .map((line) => line.split(""));

    // loop through each line in the input
    for (let i = 0; i < input.length; i++) {
      // loop through each character in the line
      for (let j = 0; j < input[i].length; j++) {
        const char = input[i][j];

        if (isSpecialCharacter(char)) {
          // find to numbers touch
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

main();

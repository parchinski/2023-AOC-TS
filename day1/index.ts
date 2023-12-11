import { readFileSync } from "fs";

const input = readFileSync("./input.txt", "utf8")
  .split("\n")
  .filter((x) => !!x);

const numbersAsString: { [key: string]: string } = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const numbers = "123456789";
let sum = 0;

input.forEach((line) => {
  const numbersInString = [];

  for (let i = 0; i < line.length; i++) {
    if (numbers.includes(line[i])) {
      numbersInString.push(line[i]);
    }

    // only need to step 3 to 5 characters to check if its a number as word
    for (let j = 3; j <= 5; j++) {
      if (numbersAsString[line.substring(i, i + j)] !== undefined) {
        numbersInString.push(numbersAsString[line.substring(i, i + j)]);
      }
    }
  }

  sum += parseInt(
    numbersInString[0] + "" + numbersInString[numbersInString.length - 1]
  );
});

console.log(sum);

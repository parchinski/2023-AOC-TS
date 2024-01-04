import { readFileSync } from "fs";

type LeftToRightMapType = { [key: string]: { L: string; R: string } };

// Make sure file name is passed
if (process.argv[2] === undefined) {
  throw new Error("Please provide an input file");
}
const fileName = process.argv[2];

const lines = readFileSync(fileName, "utf-8")
  .split("\n")
  .map((line) => line.trim())
  .filter((x) => !!x);

const instructions = lines.shift()?.split("");
const patternToLeftRightMap: LeftToRightMapType = {};
console.log(`Using instruction set ${instructions}`);

const fillDataStructures = (linesNoInstructions: string[]) => {
  for (let i = 0; i < linesNoInstructions.length; i++) {
    const line = linesNoInstructions[i];
    const trimmedLine = line.trim();
    const [pattern, leftAndRightNoParenthesis] = trimmedLine
      .split("=")
      .map((x) => x.trim());
    const [left, right] = leftAndRightNoParenthesis
      .replace(/[()]/g, "")
      .split(", ")
      .map((x) => x.trim());

    patternToLeftRightMap[pattern] = { L: left, R: right };
  }
};

fillDataStructures(lines);

const processDataWithInstructions = (
  map: LeftToRightMapType,
  instructions: string[]
) => {
  let steps = 0;
  let currentPattern = "AAA";
  let indexOnInstructions = 0;

  const processCurrentInstruction = () => {
    if (indexOnInstructions >= instructions.length) {
      indexOnInstructions = 0;
    }

    const currentInstruction = instructions[indexOnInstructions];
    const { L, R } = map[currentPattern];

    if (currentInstruction === "L") {
      currentPattern = L;
    } else {
      currentPattern = R;
    }

    indexOnInstructions++;

    return currentPattern;
  };

  while (currentPattern !== "ZZZ") {
    currentPattern = processCurrentInstruction();
    steps++;
  }

  return steps;
};

const answer = processDataWithInstructions(
  patternToLeftRightMap,
  instructions as string[]
);

console.log(`Answer to part 1: ${answer}`);

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
const patterns: string[] = [];
const patternToLeftRightMap: LeftToRightMapType = {};
console.log(`Using instruction set ${instructions}`);

const fillDataStructures = (linesNoInstructions: string[]) => {
  linesNoInstructions.forEach((line) => {
    const [pattern, leftAndRight] = line.split("=").map((x) => x.trim());

    const leftAndRightNoParenthesis = leftAndRight.replace(/[()]/g, "");

    const [left, right] = leftAndRightNoParenthesis
      .split(", ")
      .map((x) => x.trim());

    patterns.push(pattern);
    patternToLeftRightMap[pattern] = { L: left, R: right };
  });
};

fillDataStructures(lines);

const processDataWithInstructions = (
  map: LeftToRightMapType,
  instructions: string[],
  patterns: string[]
) => {
  let steps = 0;
  let currentPattern = patterns[0];
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
  instructions as string[],
  patterns
);

console.log(`Answer to part 1: ${answer}`);

import { readFileSync } from "fs";

type LeftToRightMapType = { [key: string]: { L: string; R: string } };
type InstructionType = "L" | "R";

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

const fillDataStructures = (linesNoInstructions: string[]) => {
  linesNoInstructions.forEach((line) => {
    const [pattern, leftAndRightNoParenthesis] = line
      .split("=")
      .map((x) => x.trim());
    const [left, right] = leftAndRightNoParenthesis
      .replace(/[()]/g, "")
      .split(", ")
      .map((x) => x.trim());
    patternToLeftRightMap[pattern] = { L: left, R: right };
  });
};

fillDataStructures(lines);

const findStartingNodes = (map: LeftToRightMapType): string[] => {
  return Object.keys(map).filter((key) => key.endsWith("A"));
};

const processDataWithInstructions = (
  map: LeftToRightMapType,
  instructions: string[],
  maxSteps: number = 1000000000000
): number => {
  let steps = 0;
  let currentPatterns = findStartingNodes(map);
  const patternCache = new Map<string, string>();

  while (
    !currentPatterns.every((pattern) => pattern.endsWith("Z")) &&
    steps < maxSteps
  ) {
    const instructionIndex = steps % instructions.length;
    const instruction = instructions[instructionIndex];

    currentPatterns = currentPatterns.flatMap((pattern) => {
      const cacheKey = `${pattern}-${instruction}`;
      if (patternCache.has(cacheKey)) {
        return [patternCache.get(cacheKey) as string];
      }
      const newPattern = map[pattern][instruction as InstructionType];
      if (!newPattern) {
        console.error(
          `No mapping found for pattern ${pattern} with instruction ${instruction}`
        );
        return [];
      }

      patternCache.set(cacheKey, newPattern);
      return [newPattern];
    });

    steps++;
  }

  if (steps >= maxSteps) {
    console.log("Maximum step limit reached, exiting...");
    return -1;
  }

  return steps;
};

const answer = processDataWithInstructions(
  patternToLeftRightMap,
  instructions as string[]
);

if (answer === -1) {
  console.log("Failed to reach all Z-ending patterns within the step limit.");
} else {
  console.log(`Answer to part 1: ${answer}`);
}

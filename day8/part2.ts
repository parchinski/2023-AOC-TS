import { readFileSync } from "fs";

type LeftToRightMapType = { [key: string]: { L: string; R: string } };
// type that is l or r
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
  maxSteps: number = 10000
): number => {
  let steps = 0;
  let currentPatterns = findStartingNodes(map);
  const patternCache = new Map<string, string>(); // Cache for storing pattern results

  while (
    !currentPatterns.every((pattern) => pattern.endsWith("Z")) &&
    steps < maxSteps
  ) {
    const instruction = instructions[steps % instructions.length];

    currentPatterns = currentPatterns.map((pattern) => {
      // Check if the pattern result is already in the cache
      const cacheKey = `${pattern}-${instruction}`;

      if (patternCache.has(cacheKey)) {
        return patternCache.get(cacheKey) as string;
      }

      // Compute and store the result in the cache
      const newPattern = map[pattern][instruction as InstructionType];
      patternCache.set(cacheKey, newPattern);
      return newPattern as string;
    });

    steps++;
    // Logging every 100 steps for monitoring
    if (steps % 100 === 0) {
      console.log(`Step ${steps}, Current Patterns: ${currentPatterns}`);
    }

    if (steps >= maxSteps) {
      console.log("Maximum step limit reached, exiting...");
      return -1;
    }
  }

  return steps;
};

// Usage example
const answer = processDataWithInstructions(
  patternToLeftRightMap,
  instructions as string[],
  100000000000000000
);

if (answer === -1) {
  console.log("Failed to reach all Z-ending patterns within the step limit.");
} else {
  console.log(`Answer to part 1: ${answer}`);
}

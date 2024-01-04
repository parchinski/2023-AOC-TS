import { readFileSync } from "fs";

// Make sure file name is passed
if (process.argv[2] === undefined) {
  throw new Error("Please provide an input file");
}

const fileName = process.argv[2];

const lines = readFileSync(fileName, "utf-8")
  .split("\n")
  .map((line) => line.trim())
  .filter((x) => !!x);

console.log(lines);

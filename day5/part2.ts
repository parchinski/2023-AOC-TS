// IMPORTS
import { readFileSync } from "fs";

// CONSTANTS
const FILE_NAME: string = "./input.txt";

// RANGE MAP TYPE
type RangeMap = { start: number; offset: number; length: number }[];

// RANGE MAPS
const seedToSoilMap: RangeMap = [];
const soilToFertilizerMap: RangeMap = [];
const fertilizerToWaterMap: RangeMap = [];
const waterToLightMap: RangeMap = [];
const lightToTemperatureMap: RangeMap = [];
const temperatureToHumidityMap: RangeMap = [];
const humidityToLocationMap: RangeMap = [];

type MapKey =
  | "seed-to-soil"
  | "soil-to-fertilizer"
  | "fertilizer-to-water"
  | "water-to-light"
  | "light-to-temperature"
  | "temperature-to-humidity"
  | "humidity-to-location";

const maps: Record<string, RangeMap> = {
  "seed-to-soil": seedToSoilMap,
  "soil-to-fertilizer": soilToFertilizerMap,
  "fertilizer-to-water": fertilizerToWaterMap,
  "water-to-light": waterToLightMap,
  "light-to-temperature": lightToTemperatureMap,
  "temperature-to-humidity": temperatureToHumidityMap,
  "humidity-to-location": humidityToLocationMap,
};

// FUNCTIONS
// Function to get value based on the range map
function getValueFromRangeMap(rangeMap: RangeMap, key: number): number {
  for (const range of rangeMap) {
    if (key >= range.start && key < range.start + range.length) {
      return key + range.offset;
    }
  }
  return key; // default case if not found in ranges
}

// modified version that will only store the lowest final location
const getFinalLocations = (seedRanges: [number, number][]): number | null => {
  let smallestFinalLocation = Infinity;

  seedRanges.forEach(([start, end]) => {
    for (let seed = start; seed <= end; seed++) {
      const soilNumber = getValueFromRangeMap(maps["seed-to-soil"], seed);
      const fertilizerNumber = getValueFromRangeMap(
        maps["soil-to-fertilizer"],
        soilNumber
      );
      const waterNumber = getValueFromRangeMap(
        maps["fertilizer-to-water"],
        fertilizerNumber
      );
      const lightNumber = getValueFromRangeMap(
        maps["water-to-light"],
        waterNumber
      );
      const temperatureNumber = getValueFromRangeMap(
        maps["light-to-temperature"],
        lightNumber
      );
      const humidityNumber = getValueFromRangeMap(
        maps["temperature-to-humidity"],
        temperatureNumber
      );
      const locationNumber = getValueFromRangeMap(
        maps["humidity-to-location"],
        humidityNumber
      );

      // Update the smallestFinalLocation if the current locationNumber is smaller
      if (locationNumber < smallestFinalLocation) {
        smallestFinalLocation = locationNumber;
      }
    }
  });

  return smallestFinalLocation === Infinity ? null : smallestFinalLocation;
};

const getSeeds = (seeds: string[]): [number, number][] => {
  const finalSeedRanges: [number, number][] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    const start = parseInt(seeds[i]);
    const range = parseInt(seeds[i + 1]);

    if (isNaN(start) || isNaN(range)) {
      console.error(`Invalid seed or range: ${seeds[i]}, ${seeds[i + 1]}`);
      continue;
    }

    finalSeedRanges.push([start, start + range - 1]);
  }

  return finalSeedRanges;
};

// MAIN LOGIC
const input: string[] = readFileSync(FILE_NAME, "utf-8")
  .split("\n")
  .filter((line) => line.trim());

const seedRanges = getSeeds(input[0].split(":")[1].trim().split(" "));

let currentMap: MapKey = "seed-to-soil";

for (let i = 1; i < input.length; i++) {
  // if the first char is not a number, then it is a map header
  if (isNaN(parseInt(input[i][0]))) {
    const mapName = input[i].split(" ")[0];
    currentMap = mapName as MapKey;
  } else {
    // if the first char is a number, then it is a map entry
    const [destinationRangeStart, sourceRangeStart, rangeLength] = input[i]
      .trim()
      .split(" ")
      .map((num) => parseInt(num));

    maps[currentMap].push({
      start: sourceRangeStart,
      offset: destinationRangeStart - sourceRangeStart,
      length: rangeLength,
    });
  }
}

const smallestFinalLocation = getFinalLocations(seedRanges);
console.log(`the closest location is ${smallestFinalLocation}`);

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

const getFinalLocations = (seeds: number[]): number[] => {
  const finalLocations: number[] = [];

  seeds.forEach((seed) => {
    const soilNumber: number = getValueFromRangeMap(maps["seed-to-soil"], seed);

    const fertilizerNumber: number = getValueFromRangeMap(
      maps["soil-to-fertilizer"],
      soilNumber
    );

    const waterNumber: number = getValueFromRangeMap(
      maps["fertilizer-to-water"],
      fertilizerNumber
    );

    const lightNumber: number = getValueFromRangeMap(
      maps["water-to-light"],
      waterNumber
    );

    const temperatureNumber: number = getValueFromRangeMap(
      maps["light-to-temperature"],
      lightNumber
    );

    const humidityNumber: number = getValueFromRangeMap(
      maps["temperature-to-humidity"],
      temperatureNumber
    );

    const locationNumber: number = getValueFromRangeMap(
      maps["humidity-to-location"],
      humidityNumber
    );
    finalLocations.push(locationNumber);
  });

  return finalLocations;
};

// MAIN LOGIC
const input: string[] = readFileSync(FILE_NAME, "utf-8")
  .split("\n")
  .filter((line) => line.trim());

const seeds = input[0].split(":")[1].trim().split(" ");

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

const finalLocations: number[] = getFinalLocations(
  seeds.map((seed) => parseInt(seed))
);

const smallestNumber = Math.min(...finalLocations);
console.log(`the closest location is ${smallestNumber}`);

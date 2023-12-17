// IMPORTS
import { readFileSync } from "fs";

// CONSTANTS
const FILE_NAME: string = "./input.txt";

// MAPS
const seedToSoilMap: Map<number, number> = new Map();
const soilToFertilizerMap: Map<number, number> = new Map();
const fertilizerToWaterMap: Map<number, number> = new Map();
const waterToLightMap: Map<number, number> = new Map();
const lightToTemperatureMap: Map<number, number> = new Map();
const temperatureToHumidityMap: Map<number, number> = new Map();
const humidityToLocationMap: Map<number, number> = new Map();

type MapKey =
  | "seed-to-soil"
  | "soil-to-fertilizer"
  | "fertilizer-to-water"
  | "water-to-light"
  | "light-to-temperature"
  | "temperature-to-humidity"
  | "humidity-to-location";

const maps: Record<string, Map<number, number>> = {
  "seed-to-soil": seedToSoilMap,
  "soil-to-fertilizer": soilToFertilizerMap,
  "fertilizer-to-water": fertilizerToWaterMap,
  "water-to-light": waterToLightMap,
  "light-to-temperature": lightToTemperatureMap,
  "temperature-to-humidity": temperatureToHumidityMap,
  "humidity-to-location": humidityToLocationMap,
};

// FUNCTIONS
const getFinalLocations = (seeds: number[]): number[] => {
  const finalLocations: number[] = [];

  seeds.map((seed) => {
    console.log(`Current seed is: ${seed}`);

    const soilNumber: number = getSoilNumber(seed);
    console.log(`soilNumber is: ${soilNumber}`);

    const fertilizerNumber: number = getFertilizerNumber(soilNumber);
    console.log(`fertilizerNumber is: ${fertilizerNumber}`);

    const waterNumber: number = getWaterNumber(fertilizerNumber);
    console.log(`waterNumber is: ${waterNumber}`);

    const lightNumber: number = getLightNumber(waterNumber);
    console.log(`lightNumber is: ${lightNumber}`);

    const temperatureNumber: number = getTemperatureNumber(lightNumber);
    console.log(`temperatureNumber is: ${temperatureNumber}`);

    const humidityNumber: number = getHumidityNumber(temperatureNumber);

    const locationNumber: number = getLocationNumber(humidityNumber);
    finalLocations.push(locationNumber);
  });

  return finalLocations;
};

// FUNCTION TO GET SOIL NUMBER
function getSoilNumber(seed: number): number {
  return maps["seed-to-soil"].get(seed) || seed;
}

// FUNCTION TO GET FERTILIZER NUMBER
function getFertilizerNumber(soilNumber: number): number {
  return maps["soil-to-fertilizer"].get(soilNumber) || soilNumber;
}

// FUNCTION TO GET WATER NUMBER
function getWaterNumber(fertilizerNumber: number): number {
  return maps["fertilizer-to-water"].get(fertilizerNumber) || fertilizerNumber;
}

// FUNCTION TO GET LIGHT NUMBER
function getLightNumber(waterNumber: number): number {
  return maps["water-to-light"].get(waterNumber) || waterNumber;
}

// FUNCTION TO GET TEMPERATURE NUMBER
function getTemperatureNumber(lightNumber: number): number {
  return maps["light-to-temperature"].get(lightNumber) || lightNumber;
}

// FUNCTION TO GET HUMIDITY NUMBER
function getHumidityNumber(temperatureNumber: number): number {
  return (
    maps["temperature-to-humidity"].get(temperatureNumber) || temperatureNumber
  );
}

// FUNCTION TO GET LOCATION NUMBER
function getLocationNumber(humidityNumber: number): number {
  return maps["humidity-to-location"].get(humidityNumber) || humidityNumber;
}

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

    for (let i = 0; i < rangeLength; i++) {
      maps[currentMap].set(sourceRangeStart + i, destinationRangeStart + i);
    }
  }
}

const finalLocations: number[] = getFinalLocations(
  seeds.map((seed) => parseInt(seed))
);

const smallestNumber = Math.min(...finalLocations);
console.log(`the closest location is ${smallestNumber}`);

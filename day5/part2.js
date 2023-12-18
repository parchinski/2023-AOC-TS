"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
var fs_1 = require("fs");
// CONSTANTS
var FILE_NAME = "./input.txt";
// RANGE MAPS
var seedToSoilMap = [];
var soilToFertilizerMap = [];
var fertilizerToWaterMap = [];
var waterToLightMap = [];
var lightToTemperatureMap = [];
var temperatureToHumidityMap = [];
var humidityToLocationMap = [];
var maps = {
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
function getValueFromRangeMap(rangeMap, key) {
    for (var _i = 0, rangeMap_1 = rangeMap; _i < rangeMap_1.length; _i++) {
        var range = rangeMap_1[_i];
        if (key >= range.start && key < range.start + range.length) {
            return key + range.offset;
        }
    }
    return key; // default case if not found in ranges
}
// modified version that will only store the lowest final location
var getFinalLocations = function (seedRanges) {
    var smallestFinalLocation = Infinity;
    seedRanges.forEach(function (_a) {
        var start = _a[0], end = _a[1];
        for (var seed = start; seed <= end; seed++) {
            var soilNumber = getValueFromRangeMap(maps["seed-to-soil"], seed);
            var fertilizerNumber = getValueFromRangeMap(maps["soil-to-fertilizer"], soilNumber);
            var waterNumber = getValueFromRangeMap(maps["fertilizer-to-water"], fertilizerNumber);
            var lightNumber = getValueFromRangeMap(maps["water-to-light"], waterNumber);
            var temperatureNumber = getValueFromRangeMap(maps["light-to-temperature"], lightNumber);
            var humidityNumber = getValueFromRangeMap(maps["temperature-to-humidity"], temperatureNumber);
            var locationNumber = getValueFromRangeMap(maps["humidity-to-location"], humidityNumber);
            // Update the smallestFinalLocation if the current locationNumber is smaller
            if (locationNumber < smallestFinalLocation) {
                smallestFinalLocation = locationNumber;
            }
        }
    });
    return smallestFinalLocation === Infinity ? null : smallestFinalLocation;
};
var getSeeds = function (seeds) {
    var finalSeedRanges = [];
    for (var i = 0; i < seeds.length; i += 2) {
        var start = parseInt(seeds[i]);
        var range = parseInt(seeds[i + 1]);
        if (isNaN(start) || isNaN(range)) {
            console.error("Invalid seed or range: ".concat(seeds[i], ", ").concat(seeds[i + 1]));
            continue;
        }
        finalSeedRanges.push([start, start + range - 1]);
    }
    return finalSeedRanges;
};
// MAIN LOGIC
var input = (0, fs_1.readFileSync)(FILE_NAME, "utf-8")
    .split("\n")
    .filter(function (line) { return line.trim(); });
var seedRanges = getSeeds(input[0].split(":")[1].trim().split(" "));
var currentMap = "seed-to-soil";
for (var i = 1; i < input.length; i++) {
    // if the first char is not a number, then it is a map header
    if (isNaN(parseInt(input[i][0]))) {
        var mapName = input[i].split(" ")[0];
        currentMap = mapName;
    }
    else {
        // if the first char is a number, then it is a map entry
        var _a = input[i]
            .trim()
            .split(" ")
            .map(function (num) { return parseInt(num); }), destinationRangeStart = _a[0], sourceRangeStart = _a[1], rangeLength = _a[2];
        maps[currentMap].push({
            start: sourceRangeStart,
            offset: destinationRangeStart - sourceRangeStart,
            length: rangeLength,
        });
    }
}
var smallestFinalLocation = getFinalLocations(seedRanges);
console.log("the closest location is ".concat(smallestFinalLocation));

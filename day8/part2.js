"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
if (process.argv[2] === undefined) {
    throw new Error("Please provide an input file");
}
var fileName = process.argv[2];
var lines = (0, fs_1.readFileSync)(fileName, "utf-8")
    .split("\n")
    .map(function (line) { return line.trim(); })
    .filter(function (x) { return !!x; });
var instructions = (_a = lines.shift()) === null || _a === void 0 ? void 0 : _a.split("");
var patternToLeftRightMap = {};
var fillDataStructures = function (linesNoInstructions) {
    linesNoInstructions.forEach(function (line) {
        var _a = line
            .split("=")
            .map(function (x) { return x.trim(); }), pattern = _a[0], leftAndRightNoParenthesis = _a[1];
        var _b = leftAndRightNoParenthesis
            .replace(/[()]/g, "")
            .split(", ")
            .map(function (x) { return x.trim(); }), left = _b[0], right = _b[1];
        patternToLeftRightMap[pattern] = { L: left, R: right };
    });
};
fillDataStructures(lines);
var findStartingNodes = function (map) {
    return Object.keys(map).filter(function (key) { return key.endsWith("A"); });
};
var processDataWithInstructions = function (map, instructions, maxSteps) {
    if (maxSteps === void 0) { maxSteps = 1000000000000; }
    var steps = 0;
    var currentPatterns = findStartingNodes(map);
    var patternCache = new Map();
    var _loop_1 = function () {
        var instruction = instructions[steps % instructions.length];
        currentPatterns = currentPatterns.map(function (pattern) {
            var cacheKey = "".concat(pattern, "-").concat(instruction);
            if (patternCache.has(cacheKey)) {
                return patternCache.get(cacheKey);
            }
            var newPattern = map[pattern][instruction];
            patternCache.set(cacheKey, newPattern);
            return newPattern;
        });
        steps++;
    };
    while (!currentPatterns.every(function (pattern) { return pattern.endsWith("Z"); }) &&
        steps < maxSteps) {
        _loop_1();
    }
    if (steps >= maxSteps) {
        console.log("Maximum step limit reached, exiting...");
        return -1;
    }
    return steps;
};
var answer = processDataWithInstructions(patternToLeftRightMap, instructions);
if (answer === -1) {
    console.log("Failed to reach all Z-ending patterns within the step limit.");
}
else {
    console.log("Answer to part 1: ".concat(answer));
}

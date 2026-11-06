/** @type {import("jest").Config} */
module.exports = {
  roots: ["<rootDir>/src/"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  cacheDirectory: "coverage",
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};

process.env.TZ = "UTC";

/** @type {import("jest").Config} */
module.exports = {
  roots: ["<rootDir>/src/"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  cacheDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};

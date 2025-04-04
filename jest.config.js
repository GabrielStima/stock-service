module.exports = {
  testEnvironment: "node",
  coverageDirectory: "__tests__/coverage",
  collectCoverageFrom: ["src/**/*.js"],
  testMatch: ["**/?(*.)+(spec|test).js"],
  moduleFileExtensions: ["js", "json", "node"],
};

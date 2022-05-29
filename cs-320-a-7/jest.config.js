module.exports = {
  preset: "ts-jest",
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "**/?(*.)+(test).+(ts)"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules"],
  setupFilesAfterEnv: ["jest-extended/all"],
}

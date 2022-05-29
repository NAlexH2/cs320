module.exports = {
  preset: "ts-jest",
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFilesAfterEnv: ["jest-extended/all"],
}

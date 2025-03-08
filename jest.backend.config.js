export default {
  // display name
  displayName: "backend",

  // when testing backend
  testEnvironment: "node",

  // which test to run
  testMatch: ["<rootDir>/controllers/categoryController.test.js"],

  // jest code coverage
  collectCoverage: true,
  collectCoverageFrom: ["controllers/categoryController.js"],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
    },
  },
};

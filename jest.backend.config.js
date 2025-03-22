export default {
  // display name
  displayName: "backend",

  // when testing backend
  testEnvironment: "node",

  // which test to run
  testMatch: [
    // "<rootDir>/config/*.test.js",
    // "<rootDir>/controllers/*.test.js",
    // "<rootDir>/helpers/*.test.js",
    // "<rootDir>/middlewares/*.test.js",
    // "<rootDir>/models/*.test.js",
    "<rootDir>/controllers/authController.test.js",
    "<rootDir>/controllers/categoryController.test.js",
    "<rootDir>/controllers/authController.integration.test.js",
    "<rootDir>/controllers/categoryController.integration.test.js",
  ],

  // jest code coverage
  collectCoverage: true,
  collectCoverageFrom: [
    // "config/**",
    // "controllers/**",
    // "helpers/**",
    // "middlewares/**",
    // "models/**",
    "controllers/authController.js",
    "controllers/categoryController.js",
  ],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
    },
  },
};

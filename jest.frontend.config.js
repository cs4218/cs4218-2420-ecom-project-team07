export default {
  // name displayed during tests
  displayName: "frontend",

  // simulates browser environment in jest
  // e.g., using document.querySelector in your tests
  testEnvironment: "jest-environment-jsdom",

  // jest does not recognise jsx files by default, so we use babel to transform any jsx files
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  // tells jest how to handle css/scss imports in your tests
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },

  // ignore all node_modules except styleMock (needed for css imports)
  transformIgnorePatterns: ["/node_modules/(?!(styleMock\\.js)$)"],

  // only run these tests
  testMatch: [
    "<rootDir>/client/src/context/auth.test.js",
    "<rootDir>/client/src/context/cart.test.js",
    "<rootDir>/client/src/context/search.test.js",
    "<rootDir>/client/src/hooks/useCategory.test.js",
    "<rootDir>/client/src/pages/About.test.js",
    "<rootDir>/client/src/pages/Categories.test.js",
    "<rootDir>/client/src/pages/Contact.test.js",
    "<rootDir>/client/src/pages/Pagenotfound.test.js",
    "<rootDir>/client/src/pages/Policy.test.js",
    "<rootDir>/client/src/pages/Search.test.js",
    "<rootDir>/client/src/pages/Auth/Login.test.js",
    "<rootDir>/client/src/pages/Auth/Register.test.js",
    "<rootDir>/client/src/pages/admin/AdminDashboard.test.js",
    "<rootDir>/client/src/pages/admin/AdminOrders.test.js",
    "<rootDir>/client/src/pages/admin/Products.test.js",
    "<rootDir>/client/src/pages/admin/Users.test.js",
    "<rootDir>/client/src/pages/user/Dashboard.test.js",
    "<rootDir>/client/src/pages/user/Orders.test.js",
    "<rootDir>/client/src/components/AdminMenu.test.js",
    "<rootDir>/client/src/components/UserMenu.test.js",
    "<rootDir>/client/src/components/Routes/Private.test.js",
  ],

  // jest code coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/client/src/context/auth.js",
    "<rootDir>/client/src/context/cart.js",
    "<rootDir>/client/src/context/search.js",
    "<rootDir>/client/src/hooks/useCategory.js",
    "<rootDir>/client/src/pages/About.js",
    "<rootDir>/client/src/pages/Categories.js",
    "<rootDir>/client/src/pages/Contact.js",
    "<rootDir>/client/src/pages/Pagenotfound.js",
    "<rootDir>/client/src/pages/Policy.js",
    "<rootDir>/client/src/pages/Search.js",
    "<rootDir>/client/src/pages/Auth/Login.js",
    "<rootDir>/client/src/pages/Auth/Register.js",
    "<rootDir>/client/src/pages/admin/AdminDashboard.js",
    "<rootDir>/client/src/pages/admin/AdminOrders.js",
    "<rootDir>/client/src/pages/admin/Products.js",
    "<rootDir>/client/src/pages/admin/Users.js",
    "<rootDir>/client/src/pages/user/Dashboard.js",
    "<rootDir>/client/src/pages/user/Orders.js",
    "<rootDir>/client/src/components/AdminMenu.js",
    "<rootDir>/client/src/components/UserMenu.js",
    "<rootDir>/client/src/components/Routes/Private.js",
  ],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
    },
  },
};

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testMatch: [
    "**/__tests__/*.js",
  ],
};

module.exports = config;

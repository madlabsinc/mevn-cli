const common = { testEnvironment: 'node' };

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'e2e',
      setupFilesAfterEnv: ['<rootDir>/jest/setupE2eTests.js'],
      testMatch: ['<rootDir>/__e2e__/**/*.test.js'],
      modulePathIgnorePatterns: [
        '<rootDir>/my-app/*/package.json',
        '<rootDir>/lib/*',
      ],
    },
    {
      ...common,
      displayName: 'unit',
      testMatch: ['<rootDir>/**/__tests__/*.test.js'],
      modulePathIgnorePatterns: [
        '<rootDir>/my-app/*/package.json',
        '<rootDir>/lib/*',
      ],
    },
  ],
};

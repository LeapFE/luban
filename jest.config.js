module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/packages/*/**/*.ts',
    '!**/bin/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
    '!**/dist/**',
    '!e2e/**',
  ],
  modulePathIgnorePatterns: [
    'examples/.*',
    'packages/.*/dist',
    'website/.*',
  ],
  testPathIgnorePatterns: [
    '/__arbitraries__/',
    '/node_modules/',
    '/e2e/.*/__tests__',
    '/packages/.*/dist',
  ],
};

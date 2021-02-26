module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/data/usecases/**/*.ts',
    '<rootDir>/src/validation/validations/**/*.ts',
    '<rootDir>/src/infra/**',
    '<rootDir>/src/presentation/**/controllers/**/*.ts',
    '<rootDir>/src/presentation/**/middlewares/**/*.ts',
    '<rootDir>/src/main/**/validations/**/*.ts',
    '!**/tests/**',
    '!**/migrations/**',
    '!**/protocols/**',
    '!**/index.ts',
    '!**/connection.ts'
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}

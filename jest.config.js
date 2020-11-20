module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/data/usecases/**/*.ts',
    '<rootDir>/src/validation/validations/**/*.ts',
    '<rootDir>/src/infra/**/repositories/**/*.ts',
    '<rootDir>/src/presentation/**/controllers/**/*.ts',
    '<rootDir>/src/presentation/**/middlewares/**/*.ts',
    '<rootDir>/src/main/**/validations/**/*.ts',
    '!**.hbs',
    '!**/protocols/**',
    '!**/index.ts'
  ],
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

module.exports = {
  preset 'ts-jest',
  testEnvironment 'node',
  roots ['rootDirtests'],
  testMatch [
    '__tests__.+(tstsxjs)',
    '(.)+(spectest).+(tstsxjs)'
  ],
  transform {
    '^.+.(tstsx)$' 'ts-jest',
  },
  setupFilesAfterEnv ['rootDirtestssetupjest.setup.js'],
  collectCoverageFrom [
    'src.{ts,tsx}',
    '!src.d.ts',
  ],
};
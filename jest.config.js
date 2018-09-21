module.exports = {
    bail: true,
    collectCoverage: true,
    setupFiles: ['./jest.shim.js', './jest.setup.js'],
    testPathIgnorePatterns: [
      '<rootDir>/test/'
    ]
  };

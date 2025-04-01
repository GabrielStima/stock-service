/**
 * Mock authentication module for testing
 */

const { tokens } = require("../data/auth");

module.exports = {
  verifyToken: jest.fn().mockImplementation((token) => {
    return token === tokens.valid;
  }),

  validateToken: jest.fn().mockImplementation((token) => {
    return token === tokens.valid;
  }),
};

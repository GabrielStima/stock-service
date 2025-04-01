/**
 * Mock database module for testing
 */

const { mockUser } = require("../data/auth");

// Mock User model methods
const User = {
  findOne: jest.fn().mockImplementation(({ where }) => {
    if (where.email === mockUser.email) {
      return Promise.resolve(mockUser);
    }
    return Promise.resolve(null);
  }),
};

module.exports = {
  User,
};

/**
 * Mock cryptography module for testing
 */

const { validCredentials } = require("../data/auth");

module.exports = {
  comparePass: jest.fn().mockImplementation((password, hashedPassword) => {
    // Only return true if the password matches our test "correct" password
    return Promise.resolve(password === validCredentials.password);
  }),
};

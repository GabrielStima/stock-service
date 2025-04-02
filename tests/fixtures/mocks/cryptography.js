const { validCredentials } = require("../data/auth");

module.exports = {
  comparePass: jest.fn().mockImplementation((password, hashedPassword) => {
    return Promise.resolve(password === validCredentials.password);
  }),
};

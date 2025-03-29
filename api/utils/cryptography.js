const bcrypt = require("bcrypt");

const createHash = (password) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

const comparePass = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);

  return match;
};

module.exports = { createHash, comparePass };

const jwt = require("jsonwebtoken");
const config = require("config");

const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.SECRET || config.get("server.secret"));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const validateToken = (token) => {
  if (!token) {
    return false;
  } else {
    const validateToken = verifyToken(token);
    if (!validateToken) {
      return false;
    }

    return true;
  }
};

module.exports = { verifyToken, validateToken };

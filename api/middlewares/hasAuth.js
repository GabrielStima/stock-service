const authentication = require("../utils/authentication");

module.exports = (req, res, next) => {
  const validate = authentication.validateToken(req.headers["authorization"]);

  if (!validate) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

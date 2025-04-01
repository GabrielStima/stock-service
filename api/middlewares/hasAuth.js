const authentication = require("../utils/authentication");

module.exports = (req, res, next) => {
  if (req.url !== "/api/v1/auth/login") {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }
  }

  next();
};

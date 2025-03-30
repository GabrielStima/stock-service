const jwt = require("jsonwebtoken");
const config = require("config");
const database = require("../../db/models");
const cryptography = require("../utils/cryptography");
const authentication = require("../utils/authentication");
const authValidator = require("../validators/authValidator");

module.exports = (app) => {
  const controller = {};

  controller.login = async (req, res) => {
    const { error, value } = authValidator.login.validate(req.body);
    const { email, password } = value;

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const user = await database.User.findOne({ where: { email } });

    if (await cryptography.comparePass(password, user.password)) {
      return res.status(200).json({
        message: "login success",
        token: jwt.sign(
          { id: user.id },
          process.env.SECRET || config.get("server.secret"),
          {
            expiresIn: "1h",
          }
        ),
      });
    } else {
      return res.status(400).json({
        message: "invalid data",
      });
    }
  };
  controller.validateToken = (req, res) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(400).json({
        message: "Token not provided",
      });
    }

    const isValid = authentication.verifyToken(token);

    if (!isValid) {
      return res.status(401).json({
        isValid,
      });
    }

    return res.status(200).json({
      isValid,
    });
  };

  return controller;
};

const database = require("../../db/models");
const cryptography = require("../utils/cryptography");
const authentication = require("../utils/authentication");
const userValidator = require("../validators/userValidator");

module.exports = (app) => {
  const controller = {};

  controller.listUsers = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const list = await database.User.findAll();

    return res.status(200).json(list);
  };
  controller.findUser = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { id } = req.params;
    const user = await database.User.findByPk(id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json(user);
  };
  controller.createUser = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { error, value } = userValidator.createUser.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { first_name, last_name, email, password, role, store_id } = value;
    const cryptPassword = cryptography.createHash(password);

    const user = await database.User.create({
      first_name,
      last_name,
      email,
      password: cryptPassword,
      role,
      store_id,
    });

    return res.status(201).json(user);
  };
  controller.updateUser = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { error, value } = userValidator.updateUser.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { first_name, last_name, email, password, role, store_id } = value;

    const updateUser = await database.User.update(
      {
        first_name,
        last_name,
        email,
        password,
        role,
        store_id,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updateUser[0] === 0) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("User updated successfully");
  };
  controller.deleteUser = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { id } = req.params;

    await database.User.destroy({
      where: {
        id: id,
      },
    });

    return res.status(204).send("");
  };

  return controller;
};

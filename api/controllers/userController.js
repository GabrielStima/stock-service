const database = require("../../db/models");
const cryptography = require("../utils/cryptography");
const userValidator = require("../validators/userValidator");

module.exports = (app) => {
  const controller = {};

  controller.listUsers = async (req, res) => {
    const list = await database.User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: database.Store,
          required: true,
        },
      ],
    });

    return res.status(200).json(list);
  };
  controller.listUsersByStore = async (req, res) => {
    const { store_id } = req.params;
    const list = await database.User.findAll({
      where: {
        store_id: store_id,
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: database.Store,
          required: true,
        },
      ],
    });

    return res.status(200).json(list);
  };
  controller.findUser = async (req, res) => {
    const { id } = req.params;
    const user = await database.User.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: database.Store,
          required: true,
        },
      ],
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json(user);
  };
  controller.createUser = async (req, res) => {
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
  controller.updateUserPassword = async (req, res) => {
    const { error, value } = userValidator.updateUserPassword.validate(
      req.body
    );

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { password, new_password } = value;

    const user = await database.User.findByPk(id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (await cryptography.comparePass(password, user.password)) {
      user.password = cryptography.createHash(new_password);

      try {
        await user.save();

        return res.status(200).send("Password updated successfully");
      } catch (error) {
        return res.status(400).json({
          message: error,
        });
      }
    } else {
      return res.status(400).json({
        message: "invalid data",
      });
    }
  };
  controller.deleteUser = async (req, res) => {
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

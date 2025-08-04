const database = require("../../db/models");
const roleValidator = require("../validators/roleValidator");

module.exports = (app) => {
  const controller = {};

  controller.listRoles = async (req, res) => {
    const list = await database.Role.findAll();

    return res.status(200).json(list);
  };
  controller.findRole = async (req, res) => {
    const { id } = req.params;
    const role = await database.Role.findByPk(id);

    if (!role) {
      return res.status(404).send("Role not found");
    }

    return res.status(200).json(role);
  };
  controller.createRole = async (req, res) => {
    const { error, value } = roleValidator.createRole.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name } = value;

    const role = await database.Role.create({
      name,
    });

    return res.status(201).json(role);
  };
  controller.updateRole = async (req, res) => {
    const { error, value } = roleValidator.updateRole.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { name } = value;

    const updateProduct = await database.Role.update(
      { name },
      {
        where: { id },
      }
    );

    if (updateProduct[0] === 0) {
      return res.status(404).send("Role not found");
    }

    return res.status(200).json({ message: "Role updated successfully" });
  };
  controller.deleteRole = async (req, res) => {
    const { id } = req.params;

    await database.Role.destroy({
      where: {
        id: id,
      },
    });

    return res.status(204).send("");
  };

  return controller;
};

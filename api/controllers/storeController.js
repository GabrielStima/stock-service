const database = require("../../db/models");
const storeValidator = require("../validators/storeValidator");

module.exports = (app) => {
  const controller = {};

  controller.listStores = async (req, res) => {
    const list = await database.Store.findAll({
      include: [
        {
          model: database.User,
          required: true,
          attributes: { exclude: ["password"] },
        },
      ],
    });

    return res.status(200).json(list);
  };
  controller.findStore = async (req, res) => {
    const { id } = req.params;
    const store = await database.Store.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: database.User,
          required: true,
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (!store) {
      return res.status(404).send("Store not found");
    }

    return res.status(200).json(store);
  };
  controller.createStore = async (req, res) => {
    const { error, value } = storeValidator.createStore.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, address, owner_id } = value;

    const store = await database.Store.create({
      name,
      address,
      owner_id,
    });

    return res.status(201).json(store);
  };
  controller.updateStore = async (req, res) => {
    const { error, value } = storeValidator.updateStore.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { name, address, owner_id } = value;

    const updateStore = await database.Store.update(
      {
        name,
        address,
        owner_id,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updateStore[0] === 0) {
      return res.status(404).send("Store not found");
    }

    return res.status(200).send("Store updated successfully");
  };
  controller.deleteStore = async (req, res) => {
    const { id } = req.params;

    await database.Store.destroy({
      where: {
        id: id,
      },
    });

    return res.status(204).send("");
  };

  return controller;
};

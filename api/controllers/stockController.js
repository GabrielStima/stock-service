const database = require("../../db/models");
const authentication = require("../utils/authentication");
const stockValidator = require("../validators/stockValidator");

module.exports = (app) => {
  const controller = {};

  controller.listStocks = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const list = await database.Stock.findAll();

    return res.status(200).json(list);
  };

  controller.findStock = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { id } = req.params;
    const stock = await database.Stock.findByPk(id);

    if (!stock) {
      return res.status(404).send("Stock not found");
    }

    return res.status(200).json(stock);
  };

  controller.createStock = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { error, value } = stockValidator.createStock.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { product_id, store_id, quantity } = value;

    const stock = await database.Stock.create({
      product_id,
      store_id,
      quantity,
    });

    return res.status(201).json(stock);
  };

  controller.updateStock = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { error, value } = stockValidator.updateStock.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { product_id, store_id, quantity } = value;

    const updateStock = await database.Stock.update(
      {
        product_id,
        store_id,
        quantity,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updateStock[0] === 0) {
      return res.status(404).send("Stock not found");
    }

    return res.status(200).send("Stock updated successfully");
  };

  controller.deleteStock = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { id } = req.params;

    await database.Stock.destroy({
      where: {
        id: id,
      },
    });

    return res.status(200).send("Stock deleted successfully");
  };

  return controller;
};

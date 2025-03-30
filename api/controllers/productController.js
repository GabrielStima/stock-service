const database = require("../../db/models");
const authentication = require("../utils/authentication");
const productValidator = require("../validators/productValidator");

module.exports = (app) => {
  const controller = {};

  controller.listProducts = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const list = await database.Product.findAll();

    return res.status(200).json(list);
  };
  controller.findProduct = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { id } = req.params;
    const product = await database.Product.findByPk(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    return res.status(200).json(product);
  };
  controller.createProduct = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { error, value } = productValidator.createProduct.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, price } = value;

    const user = await database.Product.create({
      name,
      description,
      price,
    });

    return res.status(201).json(user);
  };
  controller.updateProduct = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { error, value } = productValidator.updateProduct.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { name, description, price } = value;

    const updateProduct = await database.Product.update(
      {
        name,
        description,
        price,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updateProduct[0] === 0) {
      return res.status(404).send("Product not found");
    }

    return res.status(200).send("Product updated successfully");
  };
  controller.deleteProduct = async (req, res) => {
    const validate = authentication.validateToken(req.headers["authorization"]);

    if (!validate) {
      return res.status(401).send("Unauthorized");
    }

    const { id } = req.params;

    await database.Product.destroy({
      where: {
        id: id,
      },
    });

    return res.status(204).send("");
  };

  return controller;
};

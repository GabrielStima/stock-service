const database = require("../../db/models");

module.exports = (app) => {
  const controller = {};

  controller.listProducts = async (req, res) => {
    const list = await database.Product.findAll();

    return res.status(200).json(list);
  };
  controller.findProduct = async (req, res) => {
    const { id } = req.params;
    const product = await database.Product.findByPk(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    return res.status(200).json(product);
  };
  controller.createProduct = async (req, res) => {
    const { name, description, price, stock_id, store_id } = req.body;

    const user = await database.Product.create({
      name,
      description,
      price,
      stock_id,
      store_id,
    });

    return res.status(201).json(user);
  };
  controller.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock_id, store_id } = req.body;

    const updateProduct = await database.Product.update(
      {
        name,
        description,
        price,
        stock_id,
        store_id,
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

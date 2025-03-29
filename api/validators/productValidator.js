const Joi = require("joi");

const createProduct = Joi.object({
  name: Joi.string().max(25).required(),
  description: Joi.string().max(255).required(),
  price: Joi.number().integer().required(),
  stock_id: Joi.number().integer().required(),
  store_id: Joi.number().integer().required(),
});
const updateProduct = Joi.object({
  name: Joi.string().max(25),
  description: Joi.string().max(255),
  price: Joi.number().integer(),
  stock_id: Joi.number().integer(),
  store_id: Joi.number().integer(),
});

module.exports = { createProduct, updateProduct };

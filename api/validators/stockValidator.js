const Joi = require("joi");

const createStock = Joi.object({
  product_id: Joi.number().integer().required(),
  store_id: Joi.number().integer(),
  quantity: Joi.number().integer().required(),
});
const updateStock = Joi.object({
  product_id: Joi.number().integer(),
  store_id: Joi.number().integer(),
  quantity: Joi.number().integer(),
});

module.exports = { createStock, updateStock };

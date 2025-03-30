const Joi = require("joi");

const createStore = Joi.object({
  name: Joi.string().max(25).required(),
  address: Joi.string().max(255).required(),
  owner_id: Joi.number().integer(),
});
const updateStore = Joi.object({
  name: Joi.string().max(25),
  address: Joi.string().max(255),
  owner_id: Joi.number().integer(),
});

module.exports = { createStore, updateStore };

const Joi = require("joi");

const createUser = Joi.object({
  first_name: Joi.string().max(25).required(),
  last_name: Joi.string().max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().max(16).min(8).required(),
  role: Joi.string().max(25).required(),
  store_id: Joi.number().integer().required(),
});
const updateUser = Joi.object({
  first_name: Joi.string().max(25),
  last_name: Joi.string().max(25),
  email: Joi.string().email(),
  password: Joi.string().max(16).min(8),
  role: Joi.string().max(25),
  store_id: Joi.number().integer(),
});

module.exports = { createUser, updateUser };

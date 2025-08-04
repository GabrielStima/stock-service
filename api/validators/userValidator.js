const Joi = require("joi");

const createUser = Joi.object({
  first_name: Joi.string().max(25).required(),
  last_name: Joi.string().max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().max(16).min(8).required(),
  role_id: Joi.number().integer().required(),
  store_id: Joi.number().integer().required(),
});
const updateUser = Joi.object({
  first_name: Joi.string().max(25),
  last_name: Joi.string().max(25),
  email: Joi.string().email(),
  password: Joi.string().max(16).min(8),
  role_id: Joi.number().integer(),
  store_id: Joi.number().integer(),
});
const updateUserPassword = Joi.object({
  password: Joi.string().max(16).min(8).required(),
  new_password: Joi.string().max(16).min(8).required(),
});

module.exports = { createUser, updateUser, updateUserPassword };

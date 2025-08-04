const Joi = require("joi");

const createRole = Joi.object({
  name: Joi.string().max(25).required(),
});
const updateRole = Joi.object({
  name: Joi.string().max(25),
});

module.exports = { createRole, updateRole };

const Joi = require("joi");

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});

module.exports = { login };

const Joi = require('joi');

const createBackendSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  // Add more fields as needed
});

module.exports = {
  createBackendSchema,
};

const Joi = require('joi');

const createWarehouseSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  incharge_name: Joi.string().required(),
  // Add more fields as needed
});

module.exports = {
  createWarehouseSchema,
};

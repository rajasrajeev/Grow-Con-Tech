const Joi = require('joi');

const createVendorSchema = Joi.object({
  user_id: Joi.number().integer().required,
  company_name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  pin: Joi.string().required(),
  stateId: Joi.number().integer().required(),
  cityId: Joi.number().integer().required(),
  pan: Joi.string().required(),
  gst: Joi.string().required(),
  licence: Joi.string().required(),
});

module.exports = {
  createVendorSchema,
};

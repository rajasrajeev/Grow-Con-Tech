const Joi = require('joi');

const createVendorSchema = Joi.object({
  user_id: Joi.number().integer().required,
  company_name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  pin: Joi.string().required(),
  districtId: Joi.number().integer().required(),
  city: Joi.string().required(),
  pan_no: Joi.string().required(),
  gst_no: Joi.string().required(),
  licence_no: Joi.string().required(),
});

module.exports = {
  createVendorSchema,
};

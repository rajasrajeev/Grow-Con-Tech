const Joi = require('joi');

const createContractorSchema = Joi.object({
  name: Joi.string().required(),
  company_name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  licence: Joi.string().required(),
});

module.exports = {
  createContractorSchema,
};

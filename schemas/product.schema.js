const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  category_id: Joi.number().integer().required(),
  grade_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(0).required(),
  product_image: Joi.string().required(),
  base_price: Joi.number().positive().required()
});

module.exports = productSchema;

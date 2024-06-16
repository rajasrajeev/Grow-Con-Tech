const Joi = require('joi');

const doctorSchema = Joi.object({
    name: Joi.string()
        .min(3),
    speciality: Joi.string()
        .min(3),

    countryId: Joi.number(),
    stateId: Joi.number(),
    districtId: Joi.number(),
});

module.exports = doctorSchema;
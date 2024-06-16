const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .required(),

    /* email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(), */

    password: Joi.string()
        .min(5)
        .required(),

    type: Joi.number()
        .integer()
        .default(1),

    last_logged_in: Joi.date()
        .required()
        .default(() => new Date(), 'current date'),

    verified: Joi.boolean()
        .default(false),

    verificationCode: Joi.string()
        .optional(),

    createdAt: Joi.date()
        .default(() => new Date(), 'current date'),

    updatedAt: Joi.date()
        .default(() => new Date(), 'current date')
        .optional(),

    passwordResetToken: Joi.string()
        .optional(),

    passwordResetAt: Joi.date()
        .optional()
});

module.exports = userSchema;

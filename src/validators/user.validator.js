import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(250).allow('', null).optional(),
  email: Joi.string().email({ tlds: { allow: false } }).optional()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

export const checkUsernameSchema = Joi.object({
  username: Joi.string().min(1).required()
});

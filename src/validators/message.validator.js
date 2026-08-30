import Joi from 'joi';

export const sendMessageSchema = Joi.object({
  recipient: Joi.string().required().messages({
    'any.required': 'Message recipient is required'
  }),
  content: Joi.string().min(1).max(1000).required().messages({
    'string.empty': 'Message content cannot be empty',
    'string.max': 'Message cannot exceed 1000 characters',
    'any.required': 'Message content is required'
  }),
  isEncrypted: Joi.boolean().optional().default(false)
});

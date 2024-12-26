import Joi from 'joi';

// export const registerContactSchema = Joi.object({
//   name: Joi.string().min(3).max(20).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });

export const registerContactSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters and spaces.',
      'string.min': 'Name must be at least 3 characters long.',
      'string.max': 'Name must not exceed 20 characters.',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(/(?=.*[A-Z])/)
    .pattern(/(?=.*[a-z])/)
    .pattern(/(?=.*\d)/)
    .pattern(/(?=.*[@$!%*?&#])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not exceed 32 characters.',
      'string.pattern.base':
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
  passwordConfirmation: Joi.string().valid(Joi.ref('password')).messages({
    'any.only': 'Password confirmation does not match the password.',
  }),
});

// export const loginSchema = Joi.object({
//   email: Joi.string().email().required().messages({
//     'string.empty': '"email" is required',
//     'string.email': '"email" must be a valid email',
//   }),
//   password: Joi.string().required().messages({
//     'string.empty': '"password" is required',
//   }),
// });
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

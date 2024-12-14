import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

// export const createContactSchema = Joi.object({
//   name: Joi.string().min(3).max(20).required(),
//   phoneNumber: Joi.string().min(3).max(20).required(),
//   email: Joi.string().email(),
//   isFavourite: Joi.boolean(),
//   contactType: Joi.string().valid('work', 'home', 'personal').required(),
// });
// export const updateContactSchema = Joi.object({
//   name: Joi.string().min(3).max(20),
//   phoneNumber: Joi.string().min(3).max(20).trim(),
//   email: Joi.string().email(),
//   isFavourite: Joi.boolean(),
//   contactType: Joi.string().valid('work', 'home', 'personal'),
// }).or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType');

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required().min(3).max(20),
  isFavourite: Joi.boolean().required(),
  contactType: Joi.string()
    .valid(...typeList)
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
});

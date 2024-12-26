// import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
// import { Session } from '../db/models/session.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return await User.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }
};
// import { ContactsCollection } from '../db/models/Contact.js';
// export const registerContact = async (payload) => {
//   return await ContactsCollection.create(payload);
// };
// export const loginUser = async (payload) => {
//   const user = await User.findOne({ email: payload.email });
//   if (!user) {
//     throw createHttpError(401, 'Email or password is incorrect');
//   }
//   const isEqual = await bcrypt.compare(payload.password, user.password);
//   if (!isEqual) {
//     throw createHttpError(401, 'Email or password is incorrect');
//   }
// };

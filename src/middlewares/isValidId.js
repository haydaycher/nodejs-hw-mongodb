import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

import { ContactCollection } from '../db/models/Contact.js';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(createHttpError(400, 'Invalid ID'));
  }

  ContactCollection.findById(id, (err, contact) => {
    if (!contact) {
      return next(createHttpError(404, `Contact with ID ${id} not found`));
    }
    next();
  });
};

import createHttpError from 'http-errors';

import * as fs from 'node:fs/promises';
import path from 'node:path';

import * as contactServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { CONTACT_SORT_FIELDS } from '../constants/sort.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(
      req.query,
      CONTACT_SORT_FIELDS,
    );
    const filter = parseFilterParams(req.query);

    const filters = Object.keys(filter).length ? filter : undefined;

    const result = await contactServices.getContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter: filters,
      userId: req.user._id,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getContactsByIdController = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await contactServices.getContactById(id, req.user._id);

    if (!data) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const addContactsController = async (req, res, next) => {
  let photo = null;
  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );
      photo = `http://localhost:3001/photos/${req.file.filename}`;
    }
  }
  try {
    const payload = {
      ...req.body,
      userId: req.user._id,
      photo,
    };

    const newContact = await contactServices.addContact(payload);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: {
        ...newContact.toObject(),
        userId: req.user._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const upsertContactsController = async (req, res, next) => {
  const { id: _id } = req.params;

  try {
    const result = await contactServices.updateContact({
      _id,
      payload: {
        ...req.body,
        userId: req.user._id,
      },
      userId: req.user._id,
      options: { upsert: true },
    });

    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: 'Successfully created a contact!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const patchContactsController = async (req, res, next) => {
  const { id: _id } = req.params;

  try {
    const result = await contactServices.updateContact({
      _id,
      payload: req.body,
      userId: req.user._id,
    });

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactsController = async (req, res, next) => {
  const { id: _id } = req.params;

  try {
    const data = await contactServices.deleteContact({
      _id,
      userId: req.user._id,
    });

    if (!data) {
      throw createHttpError(404, `Contact not found`);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

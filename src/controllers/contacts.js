import Joi from 'joi';
import createHttpError from 'http-errors';
import { createContactSchema } from '../validation/contacts.js';
import * as contactServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// Joi-схема для валідації ID
const idSchema = Joi.string().hex().length(24).required().messages({
  'string.hex': 'ID must be a valid hexadecimal string.',
  'string.length': 'ID must be exactly 24 characters long.',
  'any.required': 'ID is required.',
});

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const { data: contacts, totalItems } = await contactServices.getAllContacts(
      {
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id,
      },
    );

    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactsByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = idSchema.validate(id);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid ID',
        data: {
          error: error.details[0].message,
        },
      });
    }

    const contact = await contactServices.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: {
          id,
          hint: 'Ensure the ID belongs to an existing contact.',
        },
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const addContactsController = async (req, res, next) => {
  try {
    await createContactSchema.validateAsync(req.body, { abortEarly: false });

    const contact = await contactServices.addContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    if (error.isJoi) {
      const details = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));

      next(createHttpError(400, 'Validation Error', { details }));
    } else {
      next(error);
    }
  }
};

export const upsertContactsController = async (req, res, next) => {
  try {
    const { id: _id } = req.params;

    const result = await contactServices.updateContact({
      _id,
      payload: req.body,
      options: {
        upsert: true,
      },
    });

    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: 'Successfully created or updated a contact!',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactsController = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const result = await contactServices.updateContact({
      _id,
      payload: req.body,
    });

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactsController = async (req, res, next) => {
  try {
    const { id: _id } = req.params;

    const data = await contactServices.deleteContact({ _id });

    if (!data) {
      throw createHttpError(404, `Contact with id ${_id} not found`);
    }

    res.status(200).json({
      status: 200,
      message: 'Contact deleted successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

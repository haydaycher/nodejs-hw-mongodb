import {
  createContactService,
  deleteContactService,
  getAllContacts,
  getContactId,
  updateContactController,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.send({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactId(contactId);

    if (!contact) {
      throw createHttpError(404, 'Contact is not found');
    }

    res.send({
      status: 200,
      message: `Contact with id ${contactId} is found!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const contact = await createContactService(req.body);
    res.status(201).send({
      status: 201,
      message: 'Contact is created!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await updateContactController(contactId, req.body);

    if (!result) {
      return next(createHttpError(404, 'Contact is not found'));
    }

    res.send({
      status: 200,
      message: 'Contact is patched!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await deleteContactService(contactId);

    if (!result) {
      return next(createHttpError(404, 'Contact is not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact as createContactService,
  updateContact as updateContactService,
  deleteContact as deleteContactService,
} from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const getContacts = ctrlWrapper(async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Contacts retrieved successfully!',
    data: contacts,
  });
});

export const getContactId = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Contact with id ${contactId} retrieved successfully!`,
    data: contact,
  });
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      400,
      'Missing required fields: name, phoneNumber, contactType',
    );
  }

  const newContact = await createContactService({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

export const updateContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const updatedContact = await updateContactService(contactId, {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  const existingContact = await getContactById(contactId);

  if (!existingContact) {
    throw createHttpError(404, 'Contact not found');
  }

  await deleteContactService(contactId);

  res.status(204).send();
});

import { ContactsCollection } from '../db/models/contact.js';
import createHttpError from 'http-errors';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactId = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact is not found');
  }
  return contact;
};

export const createContactService = async (contactData) => {
  const contact = new ContactsCollection(contactData);
  await contact.save();
  return contact;
};

export const updateContactController = async (contactId, contactData) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    contactData,
    { new: true },
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact is not found');
  }

  return updatedContact;
};

export const deleteContactService = async (contactId) => {
  const result = await ContactsCollection.findByIdAndDelete(contactId);

  if (!result) {
    throw createHttpError(404, 'Contact is not found');
  }

  return result;
};

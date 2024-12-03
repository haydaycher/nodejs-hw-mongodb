import { ContactsCollection } from '../db/models/contact.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; 
import createHttpError from 'http-errors'; 

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const contacts = await ContactsCollection.find(); // Отримуємо всі контакти
  res.json({
    status: 200,
    message: 'Contacts retrieved successfully!',
    data: contacts,
  });
});

export const getContactId = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await ContactsCollection.findById(contactId); // Знаходимо контакт за ID

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Contact with id ${contactId} retrieved successfully!`,
    data: contact,
  });
});

export const createContactService = ctrlWrapper(async (req, res) => {
  const contact = new ContactsCollection(req.body); // Створюємо новий контакт
  await contact.save(); // Зберігаємо в базі даних

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

export const updateContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    req.body,
    { new: true },
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
});

export const deleteContactService = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const result = await ContactsCollection.findByIdAndDelete(contactId);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send(); // Повертаємо статус 204, якщо контакт видалено
});

import { SORT_ORDER } from '../constants/index.js';
import { ContactCollection } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactCollection.find({ userId });

  // Додаємо фільтри
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  // Використовуємо Promise.all для оптимізації
  const [contactsCount, contacts] = await Promise.all([
    ContactCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  // Розрахунок даних пагінації
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactCollection.findOne({
    _id: contactId,
    userId,
  });
};

export const addContact = async (payload) => {
  return ContactCollection.create(payload);
};

export const updateContact = async ({ contactId, payload, userId }) => {
  return ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
};

export const deleteContact = async ({ contactId, userId }) => {
  return ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};

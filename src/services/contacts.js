import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const totalItems = await ContactsCollection.find({ userId })
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(totalItems, page, perPage);

  return {
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, userId) => {
  return await ContactsCollection.findOne({ _id: id, userId }).exec();
};

export const addContact = (payload) => ContactsCollection.create(payload);

export const updateContact = async ({ _id, userId, payload }) => {
  return await ContactsCollection.findOneAndUpdate({ _id, userId }, payload, {
    new: true,
  }).exec();
};

export const deleteContact = async ({ _id, userId }) => {
  return await ContactsCollection.findOneAndDelete({ _id, userId }).exec();
};

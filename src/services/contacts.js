// import { SORT_ORDER } from '../constants/index.js';
import { ContactCollection } from '../db/models/Contact.js';
// import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = () => {
  return ContactCollection.find();
};

export const getContactById = (id) => {
  return ContactCollection.findById(id);
};

export const addContact = (payload) => {
  return ContactCollection.create(payload);
};
export const updateContact = async ({ _id, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = async (filter) =>
  ContactCollection.findOneAndDelete(filter);

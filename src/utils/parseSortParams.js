import { SORT_ORDER } from '../constants';
const parseSortBy = (value) => {
  if (typeof value !== 'string') {
    return '_id';
  }

  const keysOfContacts = ['_id', 'name'];

  if (keysOfContacts.includes(value)) {
    return value;
  }

  return '_id';
};

const parseSortOrder = (value) => {
  if (typeof value !== 'string') {
    return SORT_ORDER.ASC;
  }

  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(value)) {
    return value;
  }

  return SORT_ORDER.ASC;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};

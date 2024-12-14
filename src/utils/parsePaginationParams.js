const pasredNumber = (number, defaultValue) => {
  if (typeof number !== 'string') return defaultValue;

  const pasredNumber = parseInt(number);
  if (Number.isNaN(pasredNumber)) return defaultValue;
  return pasredNumber;
};

export const parsePaginationParams = ({ page, perPage }) => {
  const parsedPage = pasredNumber(page, 1);
  const parsedPerPage = pasredNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};

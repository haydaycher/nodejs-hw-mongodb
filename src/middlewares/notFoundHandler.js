export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Oops..Route is not found',
  });
};

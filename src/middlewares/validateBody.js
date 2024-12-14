export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    if (err.isJoi) {
      const details = err.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));

      return res.status(400).json({
        status: 400,
        message: 'Bad Request',
        errors: details,
      });
    } else {
      next(err);
    }
  }
};

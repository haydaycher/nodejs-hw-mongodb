// import createHttpError from 'http-errors';

// export const validateBody = (schema) => async (req, res, next) => {
//   try {
//     await schema.validateAsync(req.body, { abortEarly: false });
//     next();
//   } catch (err) {
//     const error = createHttpError(400, 'Bad Request', { error: err.details });
//     next(error);
//   }
// };
import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    // Перевіряємо на наявність помилки Joi
    if (err.isJoi) {
      const details = err.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));
      const error = createHttpError(400, 'Bad Request', { details });
      next(error);
    } else {
      next(err); // Для інших помилок
    }
  }
};

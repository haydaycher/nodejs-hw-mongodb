// export const errorHandler = (error, req, res, next) => {
//   const { status = 500, message = 'Something went wrong' } = error;
//   res.status(status).json({
//     status,
//     message,
//   });
// };
// У файлі errorHandler.js
import { logger } from './logger.js';  // Імпортуємо ваш логер

export const errorHandler = (error, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = error;

  // Логування помилок
  logger.error({
    message: message,
    status: status,
    url: req.originalUrl,
    method: req.method,
    stack: error.stack,
  });

  res.status(status).json({
    status,
    message,
  });
};

export const errorHandler = (error, req, res, next) => {
  const { status = 500, message = 'Something went wrong', details } = error;

  res.status(status).json({
    status,
    message,
    ...(details && { errors: details }), // Додаємо деталі помилки, якщо вони є
  });
};

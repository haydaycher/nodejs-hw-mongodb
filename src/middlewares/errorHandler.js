import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: error.status,
      message: error.name,
      data: error,
    });
    return;
  }

  console.error(error);
  res.status(500).send({
    status: 500,
    message: 'Oops..Something went wrong',
    data: error.message,
  });
};

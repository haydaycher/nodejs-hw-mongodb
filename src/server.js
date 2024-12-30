import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { env } from '../src/utils/env.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();

  app.use('/photos', express.static(path.resolve('src/public/photos')));

  app.use(cors());
  app.use(cookieParser());

  app.use(express.json());

  app.use(logger);

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(env('PORT', 3001));
  console.log('Server started, listening on port 3001');

  console.log('Registered routes:', app._router.stack);

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};

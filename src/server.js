import fs from 'fs';
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
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs/swagger.json'), 'utf8'),
);

export const setupServer = () => {
  const app = express();

  // Важливо: використання статичних файлів
  app.use('/photos', express.static(path.resolve('src/public/photos')));

  // Підключення Swagger документації
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true, // Дозволяє користувачам шукати та досліджувати API
      customCss: '.swagger-ui .topbar { background-color: #333; }', // Можна додати власні стилі
      customSiteTitle: 'ContactApp API Docs', // Заголовок сторінки
    }),
  );

  app.use(
    cors({
      origin: 'http://localhost:3001', // якщо сервер і документація на різних портах
    }),
  );

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

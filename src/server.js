import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;

    try {
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // Middleware для обробки помилок
  app.use((err, req, res, next) => {
    console.error(err); // Логування помилок
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      error: err.message,
    });
  });

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

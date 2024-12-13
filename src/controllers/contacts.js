import createHttpError from 'http-errors';

import * as contactServices from '../services/contacts.js';

// export const getContactsController = async (req, res, next) => {
//   const data = await contactServices.getContacts();
//   res.json({
//     status: 200,
//     message: 'Successfully found contacts!',
//     data,
//   });
// };

export const getContactsController = async (req, res, next) => {
  try {
    const data = await contactServices.getContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (error) {
    next(error); // Передаємо помилку до глобального обробника
  }
};

// export const getContactsByIdController = async (req, res) => {
//   const { id } = req.params;
//   const data = await contactServices.getContactById(id);

//   if (!data) {
//     throw createHttpError(404, `Contact with id=${id} not found`);
//   }

//   res.json({
//     status: 200,
//     message: `Successfully found contact with id ${id}!`,
//     data,
//   });
// };
export const getContactsByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactServices.getContactById(id);

    if (!contact) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  } catch (error) {
    next(error); // Переконайтесь, що ви передаєте помилки далі
  }
};

// export const addContactsController = async (req, res) => {
//   const data = await contactServices.addContact(req.body);

//   res.status(201).json({
//     status: 201,
//     message: 'Successfully created a contact!',
//     data,
//   });
// };
export const addContactsController = async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.body;

    // Приклад валідації
    if (!name || name.length < 3) {
      throw createHttpError(400, 'Name must be at least 3 characters long', {
        details: ['Name is too short.'],
      });
    }

    if (!phoneNumber) {
      throw createHttpError(400, 'Phone number is required', {
        details: ['Phone number is missing.'],
      });
    }

    // ваш код для додавання контакту
  } catch (error) {
    next(error); // передаємо помилку в errorHandler
  }
};

export const upsertContactsController = async (req, res) => {
  const { id: _id } = req.params;

  const result = await contactServices.updateContact({
    _id,
    payload: req.body,
    options: {
      upsert: true,
    },
  });
  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: 'Successfully created a contact!',
    data: result.data,
  });
};
export const patchContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const result = await contactServices.updateContact({
    _id,
    payload: req.body,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { id: _id } = req.params;

  const data = await contactServices.deleteContact({ _id });

  if (!data) {
    throw createHttpError(404, `Contact not found`);
  }
  res.status(204).json({
    status: 204,
    data,
    message: 'Contact delete successfully',
  });
};

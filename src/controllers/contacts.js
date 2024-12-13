import createHttpError from 'http-errors';
import { createContactSchema } from '../validation/contacts.js';
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
    // Використовуємо Joi для валідації запиту
    await createContactSchema.validateAsync(req.body, { abortEarly: false }); // abortEarly: false щоб Joi повернув усі помилки

    // Додаємо контакт до бази даних
    const contact = await contactServices.addContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    // Якщо це помилка валідації Joi
    if (error.isJoi) {
      const details = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));

      // Створюємо помилку з додатковими даними
      next(createHttpError(400, 'Validation Error', { details }));
    } else {
      next(error); // Передаємо будь-які інші помилки в errorHandler
    }
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

import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/upload.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactsControllers.getContactsByIdController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactsControllers.addContactsController),
);

contactsRouter.put(
  '/:id',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(contactsControllers.upsertContactsController),
);

contactsRouter.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactsController),
);

contactsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactsController),
);

export default contactsRouter;

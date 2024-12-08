import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get(
  '/:id',
  ctrlWrapper(contactsControllers.getContactsByIdController),
);

contactsRouter.post(
  '/',
  ctrlWrapper(contactsControllers.addContactsController),
);

contactsRouter.put(
  '/:id',
  ctrlWrapper(contactsControllers.upsertContactsController),
);

contactsRouter.patch(
  '/:id',
  ctrlWrapper(contactsControllers.patchContactsController),
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactsControllers.deleteContactsController),
);

export default contactsRouter;

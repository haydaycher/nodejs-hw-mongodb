import express from 'express';
import {
  getContacts,
  getContactId,
  createContact,
  updateContactController,
  deleteContact,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', getContactId);
router.post('/', createContact);
router.patch('/:contactId', updateContactController);
router.delete('/:contactId', deleteContact);

export default router;

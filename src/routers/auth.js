import express from 'express';

import { registerController, loginController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { registerContactSchema, loginSchema } from '../validation/auth.js';
const router = express.Router();

const jsonParser = express.json();
router.post(
  '/register',
  jsonParser,
  validateBody(registerContactSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);
export default router;
// import express from 'express';
// import { registerController, loginController } from '../controllers/auth.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import ctrlWrapper from '../utils/ctrlWrapper.js';
// import { registerContactSchema, loginSchema } from '../validation/auth.js';

// const router = express.Router();
// router.use(express.json());

// router.post(
//   '/register',
//   validateBody(registerContactSchema),
//   ctrlWrapper(registerController),
// );

// router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

// export default router;

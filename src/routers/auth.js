import express from 'express';

import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  requestResetPasswordController,
  resetPasswordController,
  getOAuthURLController,
  confirmOauthController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  registerContactSchema,
  loginSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
  confirmOauthSchema,
} from '../validation/auth.js';
// import { generateOAuthURL } from '../utils/googleOAuth2.js';

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

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordController),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url', ctrlWrapper(getOAuthURLController));

router.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOauthSchema),
  ctrlWrapper(confirmOauthController),
);

export default router;

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetPassword,
  resetPassword,
  loginOrRegister,
} from '../services/auth.js';

import { generateOAuthURL, validateCode } from '../utils/googleOAuth2.js';

export async function registerController(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'All fields (name, email, password) are required!',
    });
  }

  try {
    const registeredUser = await registerUser({ name, email, password });

    res.status(201).send({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: registeredUser._id,
        name: registeredUser.name,
        email: registeredUser.email,
        createdAt: registeredUser.createdAt,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: 'Error registering user',
      error: err.message,
    });
  }
}

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Email and password are required',
    });
  }

  try {
    const session = await loginUser(email, password);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).send({
      status: 200,
      message: 'Successfully logged in!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
// ========================================================================
export async function requestResetPasswordController(req, res) {
  const { email } = req.body;

  await requestResetPassword(email);

  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}
export const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Token and new password are required.',
    });
  }

  try {
    await resetPassword({ token, password });

    res.status(200).send({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
// =================================================================
export async function getOAuthURLController(req, res) {
  const url = generateOAuthURL();
  res.send({
    status: 200,
    message: 'Successfully get Google OAuth URL',
    data: url,
  });
}

export async function confirmOauthController(req, res) {
  const { code } = req.body;

  const ticket = await validateCode(code);
  const session = await loginOrRegister(ticket.payload);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Login with Google successfully!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

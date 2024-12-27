import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../services/auth.js';


export async function registerController(req, res) {
  const { name, email, password } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields (name, email, password) are required!',
    });
  }

  try {
    const registeredUser = await registerUser({ name, email, password });

    res.status(201).send({
      status: 'success',
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
      status: 'error',
      message: 'Error registering user',
      error: err.message,
    });
  }
}


export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
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
      status: 'success',
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

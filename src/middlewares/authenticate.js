import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw createHttpError(401, 'Please provide access token');
    }

    const [bearer, accessToken] = authorization.split(' ', 2);

    if (bearer !== 'Bearer' || !accessToken) {
      throw createHttpError(401, 'Invalid token format');
    }

    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    // req.user = { id: user._id, name: user.name };
    next();
  } catch (err) {
    next(err);
  }
};

import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/appError.util.js';
import { asyncHandler } from './async.middleware.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to gain access.', 401));
  }

  try {
    const secret = process.env.JWT_SECRET || 'saraha_super_secret_jwt_key_2026_secure';
    const decoded = jwt.verify(token, secret);

    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid access token.', 401));
  }
});

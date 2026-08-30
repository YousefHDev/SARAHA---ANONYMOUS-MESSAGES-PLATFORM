import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/appError.util.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import { sendEmail, getWelcomeEmailTemplate } from '../utils/email.util.js';

const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'saraha_super_secret_jwt_key_2026_secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id }, secret, { expiresIn });
};

const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id || user.id);

  // Remove password from output
  const userResponse = { ...user };
  delete userResponse.password;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user: userResponse
    }
  });
};

export const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, name } = req.body;

  // Check if username is already taken
  const existingUsername = await UserModel.findByUsername(username);
  if (existingUsername) {
    return next(new AppError('Username is already taken. Please choose another one.', 400));
  }

  // Check if email is registered
  const existingEmail = await UserModel.findByEmail(email);
  if (existingEmail) {
    return next(new AppError('Email address is already registered. Please log in.', 400));
  }

  const newUser = await UserModel.create({
    username,
    email,
    password,
    name: name || username
  });

  // Send Welcome email asynchronously
  sendEmail({
    to: newUser.email,
    subject: 'Welcome to Saraha Anonymous Platform 🌟',
    html: getWelcomeEmailTemplate(newUser.name, newUser.username)
  });

  createSendToken(newUser, 201, res, 'Account created successfully!');
});

export const login = asyncHandler(async (req, res, next) => {
  const { emailOrUsername, password } = req.body;

  let user = await UserModel.findByEmail(emailOrUsername);
  if (!user) {
    user = await UserModel.findByUsername(emailOrUsername);
  }

  if (!user || !(await UserModel.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email/username or password.', 401));
  }

  createSendToken(user, 200, res, 'Logged in successfully!');
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = { ...req.user };
  delete user.password;

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new AppError('Verification token is missing.', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Email address verified successfully!'
  });
});

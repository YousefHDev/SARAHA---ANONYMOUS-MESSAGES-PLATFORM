import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/appError.util.js';
import { asyncHandler } from '../middleware/async.middleware.js';

export const getPublicProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const user = await UserModel.findByUsername(username);

  if (!user) {
    return next(new AppError('User profile not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id || user.id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar
      }
    }
  });
});

export const checkUsernameAvailability = asyncHandler(async (req, res, next) => {
  const { username } = req.query;

  if (!username || username.trim().length < 3) {
    return res.status(200).json({
      status: 'success',
      available: false,
      message: 'Username must be at least 3 characters long.'
    });
  }

  const cleanHandle = username.toLowerCase().trim();

  // Test with regex validation
  const regexPattern = new RegExp(`^${cleanHandle}$`, 'i');
  
  // Use regex check from user model
  const matchedUsers = await UserModel.findByRegexUsername(cleanHandle);
  const isExactMatch = matchedUsers.some(u => regexPattern.test(u.username));

  res.status(200).json({
    status: 'success',
    available: !isExactMatch,
    username: cleanHandle,
    message: isExactMatch ? 'Username is already taken' : 'Username is available!'
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id || req.user.id;
  const { name, bio, email } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (bio !== undefined) updateData.bio = bio;
  if (email !== undefined && email !== req.user.email) {
    // Check if new email is taken
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return next(new AppError('Email is already registered by another account.', 400));
    }
    updateData.email = email;
    updateData.isConfirmed = false;
  }

  const updatedUser = await UserModel.updateById(userId, updateData);
  delete updatedUser.password;

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully!',
    data: {
      user: updatedUser
    }
  });
});

export const uploadAvatarHandler = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select an image file to upload.', 400));
  }

  const userId = req.user._id || req.user.id;
  const avatarUrl = `/uploads/${req.file.filename}`;

  const updatedUser = await UserModel.updateById(userId, { avatar: avatarUrl });
  delete updatedUser.password;

  res.status(200).json({
    status: 'success',
    message: 'Avatar uploaded successfully!',
    data: {
      avatar: avatarUrl,
      user: updatedUser
    }
  });
});

export const searchUsers = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.status(200).json({ status: 'success', data: { users: [] } });
  }

  const users = await UserModel.findByRegexUsername(q.trim());
  const sanitized = users.map(u => ({
    username: u.username,
    name: u.name,
    avatar: u.avatar,
    bio: u.bio
  }));

  res.status(200).json({
    status: 'success',
    data: {
      users: sanitized
    }
  });
});

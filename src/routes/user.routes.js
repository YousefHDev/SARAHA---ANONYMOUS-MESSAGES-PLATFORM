import express from 'express';
import {
  getPublicProfile,
  checkUsernameAvailability,
  updateProfile,
  uploadAvatarHandler,
  searchUsers
} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema, checkUsernameSchema } from '../validators/user.validator.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadAvatar } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/public/:username', getPublicProfile);
router.get('/check-username', validate(checkUsernameSchema, 'query'), checkUsernameAvailability);
router.get('/search', searchUsers);

// Protected routes
router.use(protect);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.post('/avatar', uploadAvatar.single('avatar'), uploadAvatarHandler);

export default router;

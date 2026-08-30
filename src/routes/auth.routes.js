import express from 'express';
import { signup, login, getMe, verifyEmail } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { signupSchema, loginSchema, emailVerifySchema } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/verify-email', validate(emailVerifySchema), verifyEmail);

export default router;

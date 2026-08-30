import express from 'express';
import { sendMessage, getInbox, toggleFreeze, deleteMessage } from '../controllers/message.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { sendMessageSchema } from '../validators/message.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to send anonymous message
router.post('/send', validate(sendMessageSchema), sendMessage);

// Protected inbox routes
router.use(protect);
router.get('/inbox', getInbox);
router.put('/:id/freeze', toggleFreeze);
router.delete('/:id', deleteMessage);

export default router;

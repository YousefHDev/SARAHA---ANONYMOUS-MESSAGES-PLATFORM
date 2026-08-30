import { MessageModel } from '../models/message.model.js';
import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/appError.util.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import { encryptText, decryptText } from '../utils/crypto.util.js';
import { sendEmail, getNewMessageEmailTemplate } from '../utils/email.util.js';

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { recipient, content, isEncrypted } = req.body;

  // Verify recipient exists by username or ID
  let targetUser = await UserModel.findByUsername(recipient);
  if (!targetUser) {
    targetUser = await UserModel.findById(recipient);
  }

  if (!targetUser) {
    return next(new AppError('Recipient user profile does not exist.', 404));
  }

  const targetUserId = (targetUser._id || targetUser.id).toString();

  // Process message encryption if requested
  const finalContent = isEncrypted ? encryptText(content) : content;

  const newMessage = await MessageModel.create({
    recipient: targetUserId,
    content: finalContent,
    isEncrypted: !!isEncrypted,
    isFrozen: false
  });

  // Send notification email asynchronously
  if (targetUser.email) {
    sendEmail({
      to: targetUser.email,
      subject: 'You have received a new anonymous message on Saraha 💌',
      html: getNewMessageEmailTemplate(targetUser.username)
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Anonymous message sent successfully!',
    data: {
      messageId: newMessage._id || newMessage.id
    }
  });
});

export const getInbox = asyncHandler(async (req, res, next) => {
  const userId = (req.user._id || req.user.id).toString();
  const rawMessages = await MessageModel.findForRecipient(userId);

  // Decrypt content if encrypted
  const processedMessages = rawMessages.map(msg => {
    let text = msg.content;
    if (msg.isEncrypted) {
      text = decryptText(msg.content);
    }
    return {
      ...msg,
      content: text
    };
  });

  res.status(200).json({
    status: 'success',
    results: processedMessages.length,
    data: {
      messages: processedMessages
    }
  });
});

export const toggleFreeze = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = (req.user._id || req.user.id).toString();

  const message = await MessageModel.findById(id);
  if (!message) {
    return next(new AppError('Message not found.', 404));
  }

  if (message.recipient !== userId) {
    return next(new AppError('You do not have permission to modify this message.', 403));
  }

  const updated = await MessageModel.toggleFreeze(id);

  res.status(200).json({
    status: 'success',
    message: updated.isFrozen ? 'Message pinned/frozen to top!' : 'Message unfrozen.',
    data: {
      message: updated
    }
  });
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = (req.user._id || req.user.id).toString();

  const message = await MessageModel.findById(id);
  if (!message) {
    return next(new AppError('Message not found.', 404));
  }

  if (message.recipient !== userId) {
    return next(new AppError('You do not have permission to delete this message.', 403));
  }

  await MessageModel.deleteById(id);

  res.status(200).json({
    status: 'success',
    message: 'Message deleted successfully!'
  });
});

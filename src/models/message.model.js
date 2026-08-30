import mongoose from 'mongoose';
import { isMongoConnected } from '../config/db.js';
import { jsonDb } from '../services/jsonDb.service.js';

const messageSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: [true, 'Message recipient is required'],
      index: true
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    isEncrypted: {
      type: Boolean,
      default: false
    },
    isFrozen: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const MongooseMessage = mongoose.model('Message', messageSchema);

export class MessageModel {
  static async create(msgData) {
    if (isMongoConnected) {
      const msg = await MongooseMessage.create(msgData);
      return msg.toObject();
    } else {
      return jsonDb.createMessage(msgData);
    }
  }

  static async findForRecipient(recipientId) {
    if (isMongoConnected) {
      return await MongooseMessage.find({ recipient: recipientId }).sort({ createdAt: -1 }).lean();
    } else {
      return jsonDb.findMessages({ recipient: recipientId });
    }
  }

  static async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongooseMessage.findById(id).lean();
      } catch (e) {
        return null;
      }
    } else {
      return jsonDb.findMessageById(id);
    }
  }

  static async toggleFreeze(id) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const newFrozenState = !existing.isFrozen;

    if (isMongoConnected) {
      return await MongooseMessage.findByIdAndUpdate(
        id,
        { isFrozen: newFrozenState },
        { new: true }
      ).lean();
    } else {
      return jsonDb.updateMessage(id, { isFrozen: newFrozenState });
    }
  }

  static async deleteById(id) {
    if (isMongoConnected) {
      try {
        const result = await MongooseMessage.findByIdAndDelete(id);
        return !!result;
      } catch (e) {
        return false;
      }
    } else {
      return jsonDb.deleteMessage(id);
    }
  }
}

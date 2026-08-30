import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isMongoConnected } from '../config/db.js';
import { jsonDb } from '../services/jsonDb.service.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    name: {
      type: String,
      trim: true,
      default: function () {
        return this.username;
      }
    },
    bio: {
      type: String,
      default: 'Leave a constructive message or feedback anonymously!'
    },
    avatar: {
      type: String,
      default: '/uploads/default-avatar.svg'
    },
    isConfirmed: {
      type: Boolean,
      default: true
    },
    emailVerificationToken: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Hash password before saving in Mongoose
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const MongooseUser = mongoose.model('User', userSchema);

export class UserModel {
  static async create(userData) {
    const cleanUserData = {
      ...userData,
      username: userData.username ? userData.username.toLowerCase().trim() : userData.username,
      email: userData.email ? userData.email.toLowerCase().trim() : userData.email
    };

    if (isMongoConnected) {
      const user = await MongooseUser.create(cleanUserData);
      return user.toObject();
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      return jsonDb.createUser({
        ...cleanUserData,
        password: hashedPassword
      });
    }
  }

  static async findByUsername(username) {
    if (!username) return null;
    const cleanUsername = username.toLowerCase().trim();
    if (isMongoConnected) {
      return await MongooseUser.findOne({ username: cleanUsername }).select('+password').lean();
    } else {
      return jsonDb.findUser({ username: cleanUsername });
    }
  }

  static async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected) {
      return await MongooseUser.findOne({ email: cleanEmail }).select('+password').lean();
    } else {
      return jsonDb.findUser({ email: cleanEmail });
    }
  }

  static async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongooseUser.findById(id).lean();
      } catch (e) {
        return null;
      }
    } else {
      return jsonDb.findUserById(id);
    }
  }

  static async findByRegexUsername(query) {
    const regex = new RegExp(`^${query}`, 'i');
    if (isMongoConnected) {
      return await MongooseUser.find({ username: regex }).select('username name avatar bio').lean();
    } else {
      return jsonDb.findUsers({}).filter(u => regex.test(u.username));
    }
  }

  static async updateById(id, updateData) {
    const data = { ...updateData };
    if (data.username) data.username = data.username.toLowerCase().trim();
    if (data.email) data.email = data.email.toLowerCase().trim();

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    if (isMongoConnected) {
      return await MongooseUser.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    } else {
      return jsonDb.updateUser(id, data);
    }
  }

  static async checkPassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

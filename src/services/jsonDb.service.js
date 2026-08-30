import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '../../data/db.json');

class JSONDatabaseService {
  constructor() {
    this.data = { users: [], messages: [] };
    this.init();
  }

  init() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (!this.data.users) this.data.users = [];
        if (!this.data.messages) this.data.messages = [];
      } catch (e) {
        console.warn('⚠️ JSON DB file corrupted or empty, resetting data.');
        this.data = { users: [], messages: [] };
        this.save();
      }
    }
  }

  save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  generateId() {
    return (Date.now().toString(36) + Math.random().toString(36).substring(2, 9));
  }

  // User Operations
  findUsers(query = {}) {
    return this.data.users.filter(user => {
      for (const key in query) {
        if (user[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findUser(query = {}) {
    return this.data.users.find(user => {
      for (const key in query) {
        if (query[key] instanceof RegExp) {
          if (!query[key].test(user[key])) return false;
        } else if (typeof query[key] === 'string' && typeof user[key] === 'string') {
          if (user[key].toLowerCase().trim() !== query[key].toLowerCase().trim()) return false;
        } else if (user[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  findUserById(id) {
    return this.data.users.find(u => u._id === id || u.id === id);
  }

  createUser(userData) {
    const cleanUsername = userData.username ? userData.username.toLowerCase().trim() : userData.username;
    const cleanEmail = userData.email ? userData.email.toLowerCase().trim() : userData.email;
    const newUser = {
      _id: this.generateId(),
      id: undefined,
      username: cleanUsername,
      email: cleanEmail,
      password: userData.password,
      name: userData.name || cleanUsername,
      bio: userData.bio || 'Hello, send me anonymous thoughts!',
      avatar: userData.avatar || '/uploads/default-avatar.svg',
      isConfirmed: userData.isConfirmed ?? true,
      emailVerificationToken: userData.emailVerificationToken || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    newUser.id = newUser._id;
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updateData) {
    const index = this.data.users.findIndex(u => u._id === id || u.id === id);
    if (index === -1) return null;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.users[index];
  }

  // Message Operations
  createMessage(msgData) {
    const newMsg = {
      _id: this.generateId(),
      id: undefined,
      recipient: msgData.recipient,
      content: msgData.content,
      isEncrypted: msgData.isEncrypted || false,
      isFrozen: msgData.isFrozen || false,
      createdAt: new Date().toISOString()
    };
    newMsg.id = newMsg._id;
    this.data.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  findMessages(query = {}) {
    let list = this.data.messages.filter(msg => {
      for (const key in query) {
        if (msg[key] !== query[key]) return false;
      }
      return true;
    });
    // Sort by newest first
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  findMessageById(id) {
    return this.data.messages.find(m => m._id === id || m.id === id);
  }

  updateMessage(id, updateData) {
    const index = this.data.messages.findIndex(m => m._id === id || m.id === id);
    if (index === -1) return null;
    this.data.messages[index] = {
      ...this.data.messages[index],
      ...updateData
    };
    this.save();
    return this.data.messages[index];
  }

  deleteMessage(id) {
    const index = this.data.messages.findIndex(m => m._id === id || m.id === id);
    if (index === -1) return false;
    this.data.messages.splice(index, 1);
    this.save();
    return true;
  }
}

export const jsonDb = new JSONDatabaseService();

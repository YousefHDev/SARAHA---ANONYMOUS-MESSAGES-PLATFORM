import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/saraha_db';
  try {
    // Attempt Mongoose connection with 3 second timeout
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('✅ MongoDB Connected Successfully via Mongoose ODM');
  } catch (error) {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB connection failed. Falling back to persistent JSON database engine.');
    console.warn('👉 App will run seamlessly with file-based DB stored in ./data/db.json');
  }
};

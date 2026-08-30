import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Attempt DB Connection (Mongoose with JSON DB fallback)
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`
🚀 =================================================== 🚀
   SARAHA - ANONYMOUS MESSAGES PLATFORM IS RUNNING!
   
   🌐 Local URL: http://localhost:${PORT}
   📡 Healthcheck: http://localhost:${PORT}/api/v1/health
   🔒 Mode: ${process.env.NODE_ENV || 'development'}
🚀 =================================================== 🚀
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();

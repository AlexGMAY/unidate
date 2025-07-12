import mongoose from 'mongoose';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

export const connectToDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/unidate';
  
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('✅ MongoDB Connected');
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
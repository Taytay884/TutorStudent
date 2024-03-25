import * as mongoose from 'mongoose';

async function initMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
      dbName: process.env.MONGO_DB,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
    console.log('Error connecting to MongoDB');
    throw error;
  }
}

export { initMongoConnection };
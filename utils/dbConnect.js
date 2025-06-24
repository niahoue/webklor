// your-project-root/utils/dbConnect.js
const mongoose = require('mongoose');
const config = require('../config/config'); // Assurez-vous que le chemin est correct depuis utils/

let cachedDb = null;

async function dbConnect() {
  if (cachedDb) {
    return cachedDb;
  }

  if (mongoose.connections[0].readyState) {
    console.log('Using existing MongoDB connection.');
    cachedDb = mongoose.connections[0].db;
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Pas besoin de useCreateIndex et useFindAndModify avec Mongoose 6+
    });
    console.log('New MongoDB connection established.');
    cachedDb = conn.connections[0].db;
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

module.exports = dbConnect;
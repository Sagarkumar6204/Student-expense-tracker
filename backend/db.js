// backend/db.js
// MongoDB Atlas connection configuration with Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI === 'your_mongodb_atlas_connection_string_here') {
    console.log('\n⚠️  [MongoDB Atlas Notice]');
    console.log('MONGO_URI is not set or has placeholder value in backend/.env.');
    console.log('The backend server is running in offline/unconnected mode.');
    console.log('To connect real database: Add your MongoDB Atlas connection string in backend/.env\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ [MongoDB Atlas Error] Connection failed:');
    console.error(error.message);
    console.log('Check your MongoDB Atlas username, password, network IP access (whitelist 0.0.0.0/0), or internet connection.\n');
    return false;
  }
};

module.exports = connectDB;

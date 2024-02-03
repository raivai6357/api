const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const param = {
      dbName: process.env.DB_NAME,
    };
    const conn = await mongoose.connect(process.env.MONGO_URI, param);

    if (conn) {
      console.log(
        `MongoDB connected at ${conn.connection.host}:${conn.connection.port}`
      );
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

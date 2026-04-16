const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌", error.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
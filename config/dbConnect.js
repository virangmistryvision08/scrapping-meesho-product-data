const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });

    console.log("✔ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Error!", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

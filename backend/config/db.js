import mongoose  from "mongoose";
export const DbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/protask`);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};
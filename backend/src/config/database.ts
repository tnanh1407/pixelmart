import mongoose from "mongoose";
import env from "./env.ts";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(env.URL_MONGODB);

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error : any ) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDatabase;

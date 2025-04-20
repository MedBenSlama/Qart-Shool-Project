import mongoose from "mongoose";
import log from "./logger.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log.info("MongoDB connected");
  } catch (err) {
    log.error({ err }, "Failed to connect to MongoDB");
    process.exit(1);
  }
};

export default connectToDB;

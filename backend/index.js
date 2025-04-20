import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import connectToDB from "./utils/connectToDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import qartRoutes from "./routes/qartRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import log from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/qarts", qartRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
connectToDB().then(() => {
  app.listen(PORT, () => log.info(`Server running on port ${PORT}`));
});

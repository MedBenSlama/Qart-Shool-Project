import { Router } from "express";
import  authenticate  from "../middlewares/authMiddleware.js";
import {
  createComment,
  getByQart,
  deleteComment,
} from "../controllers/commentController.js";

const router = Router();

// Get comments by qart - no auth required as per README
router.get("/qart/:qartId", getByQart);

// Protected routes
router.use(authenticate);

// Create comment
router.post("/", createComment);

// Delete comment
router.delete("/:id", deleteComment);

export default router;

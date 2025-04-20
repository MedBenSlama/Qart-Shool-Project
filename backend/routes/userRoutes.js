import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  avatarUpload,
  handleMulterError,
} from "../middlewares/uploadMiddleware.js";
import {
  getProfile,
  updateAvatar,
  updateProfile,
  follow,
  unfollow,
} from "../controllers/userController.js";

const router = Router();

router.get("/me", auth, getProfile);
router.put(
  "/me/avatar",
  auth,
  avatarUpload.single("avatar"),
  handleMulterError,
  updateAvatar
);
router.put("/me", auth, updateProfile);
router.post("/:id/follow", auth, follow);
router.post("/:id/unfollow", auth, unfollow);

export default router;

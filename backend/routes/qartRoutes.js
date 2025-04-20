import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  qartUpload,
  handleMulterError,
} from "../middlewares/uploadMiddleware.js";
import {
  create,
  getAll,
  getById,
  deleteQart,
  getByUserId,
  likeQart,
  unlikeQart,
  getLikedQarts,
} from "../controllers/qartController.js";

const router = Router();

router.get("/", auth, getAll);
router.get("/liked", auth, getLikedQarts);
router.post("/", auth, qartUpload.single("image"), handleMulterError, create);
router.get("/user/:userId", auth, getByUserId);
router.get("/:id", auth, getById);
router.delete("/:id", auth, deleteQart);
router.post("/:id/like", auth, likeQart);
router.post("/:id/unlike", auth, unlikeQart);

export default router;

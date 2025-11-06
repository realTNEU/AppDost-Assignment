// server/routes/postRoutes.js
import express from "express";
import {
  createPost,
  getFeed,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getFeed);
router.post("/", protect, createPost);
router.patch("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);

export default router;

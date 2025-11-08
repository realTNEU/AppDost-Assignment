import express from "express";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import {
  createPost,
  getUserPosts,
  getFeed,
  toggleLike,
  toggleDislike,
  addComment,
  updatePost,
  deletePost,
  getPostsByUserId,
} from "../controllers/postController.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);
router.get("/feed", optionalAuth, getFeed);
router.get("/user", protect, getUserPosts);
router.get("/user/:userId", optionalAuth, getPostsByUserId);
router.patch("/:id/like", protect, toggleLike);
router.patch("/:id/dislike", protect, toggleDislike);
router.post("/:id/comments", protect, addComment);
router.patch("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

export default router;

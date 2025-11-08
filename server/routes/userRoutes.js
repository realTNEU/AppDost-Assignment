import express from "express";
import {
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../utils/cloudinary.js";

const router = express.Router();

// Protected profile routes
router.get("/me", protect, getProfile);
router.put("/update-profile", protect, uploadAvatar.single("avatar"), updateProfile);

// Public password reset routes (must come before /:userId)
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Public user browsing routes (must come after specific routes)
router.get("/", optionalAuth, getAllUsers);
router.get("/:userId", optionalAuth, getUserById);

export default router;

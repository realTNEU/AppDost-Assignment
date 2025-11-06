// server/routes/userRoutes.js
import express from "express";
import { getProfile, updateProfile, requestPasswordReset, resetPassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.patch("/me", protect, updateProfile);

// password reset (public)
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;

// server/controllers/userController.js
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// Get current user's profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // set by protect middleware
    res.json({ user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, bio: user.bio, avatarUrl: user.avatarUrl } });
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

// Update profile (allow only safe fields)
export const updateProfile = async (req, res) => {
  try {
    const allowed = ["firstName", "lastName", "bio", "avatarUrl"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password -passwordResetToken -passwordResetExpires");
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: "Profile update failed", error: err.message });
  }
};

// Request password reset - sends email with token link
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      // don't reveal whether email exists
      return res.json({ message: "If an account with that email exists, you will receive a reset email." });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    const html = `
      <p>You requested a password reset for AppDost.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail(user.email, "AppDost Password Reset", `Reset your password: ${resetUrl}`, html);

    res.json({ message: "If an account with that email exists, you will receive a reset email." });
  } catch (err) {
    res.status(500).json({ message: "Could not send reset email" });
  }
};

// Reset password using token
export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) return res.status(400).json({ message: "Missing data" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ email, passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please log in with your new password." });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed", error: err.message });
  }
};

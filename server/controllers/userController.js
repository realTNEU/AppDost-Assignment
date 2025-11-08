import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({ user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, bio: user.bio, avatarUrl: user.avatarUrl } });
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowed = ["firstName", "lastName", "bio", "avatarUrl"];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    // Use Cloudinary URL if avatar file was uploaded
    if (req.file?.path) {
      updates.avatarUrl = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password -passwordResetToken -passwordResetExpires");
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: "Profile update failed", error: err.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If an account with that email exists, you will receive a reset email." });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    const html = `
      <p>You requested a password reset for PublicFeed.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail(user.email, "PublicFeed Password Reset", `Reset your password: ${resetUrl}`, html);

    res.json({ message: "If an account with that email exists, you will receive a reset email." });
  } catch (err) {
    res.status(500).json({ message: "Could not send reset email" });
  }
};

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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("firstName lastName avatarUrl bio createdAt")
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("firstName lastName avatarUrl bio email createdAt");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

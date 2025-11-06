// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // Basic info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },

    // Authentication
    password: { type: String, required: true, minlength: 8, select: false },
    isVerified: { type: Boolean, default: false },

    // OTP Verification
    otp: { type: String, select: false }, // Store hashed OTP
    otpExpires: { type: Date },

    // Profile
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    // Password Reset
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 🔐 Compare candidate password
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Generate password reset token (plain returned, hashed stored)
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

// 🔐 Generate OTP for email verification (hashed before saving)
userSchema.methods.createOTP = function () {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  this.otp = crypto.createHash("sha256").update(otp).digest("hex");
  this.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  return otp; // return plain OTP for emailing
};

// 🔍 Validate OTP
userSchema.methods.verifyOTP = function (enteredOtp) {
  const hashed = crypto.createHash("sha256").update(enteredOtp).digest("hex");
  return this.otp === hashed && this.otpExpires > Date.now();
};

export default mongoose.model("User", userSchema);

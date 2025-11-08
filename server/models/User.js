import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createOTP = function () {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  this.otp = crypto.createHash("sha256").update(otp).digest("hex");
  this.otpExpires = Date.now() + 5 * 60 * 1000;
  return otp;
};

userSchema.methods.verifyOTP = function (enteredOtp) {
  const hashed = crypto.createHash("sha256").update(enteredOtp).digest("hex");
  return this.otp === hashed && this.otpExpires > Date.now();
};

export default mongoose.model("User", userSchema);

// server/controllers/authController.js
import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/User.js"
import { sendEmail } from "../utils/sendEmail.js"

// Generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })

// --- USER SIGNUP ---
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(400).json({ message: "Email already registered" })

    // create a new user object (not saved yet)
    const user = new User({ firstName, lastName, email, password })

    // generate OTP (4-digit)
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")
    user.otp = hashedOtp
    user.otpExpires = Date.now() + 5 * 60 * 1000 // 5 minutes

    // send email before saving user
    await sendEmail(
      email,
      "Your AppDost Verification Code",
      `Your OTP code is ${otp}`,
      `<div style="font-family:sans-serif;font-size:16px">
         <p>Welcome to <b>AppDost</b>, ${firstName}!</p>
         <p>Your verification code is:</p>
         <h2 style="color:#9b59b6;letter-spacing:4px">${otp}</h2>
         <p>This code expires in 5 minutes.</p>
       </div>`
    )

    // save user only if email sent successfully
    await user.save()

    res.status(201).json({
      message: "OTP sent to your email for verification",
    })
  } catch (err) {
    console.error("Signup Error:", err)
    res.status(500).json({
      message: "Signup failed",
      error: err.message,
    })
  }
}

// --- OTP VERIFICATION ---
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email }).select("+otp +otpExpires")
    if (!user) return res.status(404).json({ message: "User not found" })
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" })

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    if (user.otp !== hashedOtp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    // mark verified and remove otp fields
    user.isVerified = true
    user.otp = undefined
    user.otpExpires = undefined
    await user.save()

    const token = signToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(200).json({
      message: "✅ Email verified successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    })
  } catch (err) {
    console.error("OTP Verify Error:", err)
    res.status(500).json({
      message: "OTP verification failed",
      error: err.message,
    })
  }
}

// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select("+password")

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" })

    const isPasswordCorrect = await user.correctPassword(password)
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" })

    if (!user.isVerified)
      return res.status(401).json({ message: "Email not verified yet" })

    const token = signToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (err) {
    console.error("Login Error:", err)
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    })
  }
}

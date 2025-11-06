import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import connectDB from "./utils/connectDB.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

dotenv.config()
const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json({ limit: "10kb" }))
app.use(cookieParser())

// ✅ Custom sanitizer (avoids req.query crash)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body)
  if (req.params) mongoSanitize.sanitize(req.params)
  // Skip req.query since it's read-only in Express 4.19+
  next()
})

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// ✅ Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ message: "Server error", error: err.message })
})

const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`)
  })
})

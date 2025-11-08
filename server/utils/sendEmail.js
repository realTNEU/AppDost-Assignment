// server/utils/sendEmail.js
import nodemailer from "nodemailer"

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"PublicFeed" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent:", info.messageId)
    return info
  } catch (err) {
    console.error("❌ Email sending failed:", err.message)
    throw new Error("Failed to send verification email")
  }
}

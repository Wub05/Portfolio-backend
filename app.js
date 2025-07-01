import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ POST route to send mail
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // ⚠️ Handle empty fields
  if (!name || !email || !message) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ✅ FIXED: this was incorrect
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`, // shows user's email as sender
      to: process.env.EMAIL_TO,
      subject: `[✨Your💕Portfolio✨] New message from <${name}>`,
      replyTo: email, // ✅ user’s email used for reply
      text: `
You have a new message from your portfolio contact form.
--------------------------------------------------------

Name: ${name}
Email: ${email}

Message:
--------
${message}
      `,
    });

    return res.status(200).json({ msg: " Message sent successfully ✔" });
  } catch (error) {
    console.error("Email sending error:", error);
    return res
      .status(500)
      .json({ msg: " Failed to send message. Please try again later." });
  }
});

// ✅ Listener
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

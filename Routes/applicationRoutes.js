const express = require("express");
const router = express.Router();
const db = require("../Model/db");

// Optional: Nodemailer for email
const nodemailer = require("nodemailer");

// You can use environment variables for email credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Add this in .env
    pass: process.env.EMAIL_PASS, // Add this in .env
  },
});

// Unified form submission route
router.post("/apply", async (req, res) => {
  const { formType, fullName, uspId, email, reason, date } = req.body;

  try {
    const sql = `
      INSERT INTO applications (form_type, full_name, usp_id, email, reason, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [formType, fullName, uspId, email, reason, date]);

    // Optional: Send confirmation email for specific form types
    if (formType.toLowerCase() === "graduation") {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Graduation Application Received",
        text: `Dear ${fullName},\n\nYour graduation application has been received.\n\nRegards,\nUSP Admin`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("Email error:", err);
        else console.log("Confirmation email sent:", info.response);
      });
    }

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error inserting application:", error);
    res.status(500).json({ error: "Database error", code: "APPLICATION_ERROR" });
  }
});

module.exports = router;

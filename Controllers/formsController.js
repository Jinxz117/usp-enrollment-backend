
const nodemailer = require("nodemailer");
const db = require("../utils/db");

exports.getAllGraduation = (req, res) => {
  try {
    const data = db.get("graduation").value();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve graduation applications." });
  }
};

exports.getAllCompassionate = (req, res) => {
  try {
    const data = db.get("compassionate").value();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve compassionate applications." });
  }
};

exports.getAllResit = (req, res) => {
  try {
    const data = db.get("resit").value();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve resit applications." });
  }
};


// exports.handleDecision = async (req, res) => {
//   const { applicationType, applicationId, email, decision, reason } = req.body;

//   // Update the application in the db (example for lowdb)
//   const app = db.get(applicationType)
//     .find({ Id: applicationId })
//     .assign({ status: decision, decisionReason: reason })
//     .write();

exports.handleDecision = async (req, res) => {
  const { applicationType, applicationId, email, decision, reason, admin } = req.body;

  // Find and update the application in the db (example for lowdb)
  const app = db.get(applicationType)
    .find({ Id: applicationId })
    .assign({
      applicationDecision: {
        decision,
        reason,
        decidedBy: {
          id: admin.id,
          name: admin.name
        },
        timestamp: admin.timestamp
      }
    })
    .write();


  // Send email
  const transporter = nodemailer.createTransport({
    // configure your SMTP here
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Your ${applicationType} application has been ${decision}`,
    text: `Dear Student,\n\nYour application has been ${decision}.\nReason: ${reason}\n\nRegards,\nUSP Admin`
  };
   
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email error:", err);
      else console.log("Confirmation email sent:", info.response);
    });

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email." });
  }
};
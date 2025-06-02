// const express = require("express");
// const router = express.Router();
// const ADODB = require("node-adodb");

// process.env.PATH += ';C:\\Windows\\System32\cscript.exe';


// // Update this path to your .accdb file
// const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\naray\\Documents\\GitHub\\usp-enrollment-backend\\msaccdb_forms\\usp_enrollment.accdb;Persist Security Info=False;');

// // Graduation
// router.post("/submit-graduation", async (req, res) => {
//   const d = req.body;
//   const sql = `
//     INSERT INTO GraduationApplications (fullName, title, studentId, dob, telephone, email, address, program, gradSemester, declaration, appDate, appSignature)
//     VALUES ('${d.fullName}', '${d.title}', '${d.Id}', '${d.dob}', '${d.telephone}', '${d.email}', '${d.address}', '${d.program}', '${d.gradSemester}', '${d.declaration}', '${d.appDate}', '${d.appSignature}')
//   `;
//   try {
//     await connection.execute(sql);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Compassionate
// router.post("/submit-compassionate", async (req, res) => {
//   const d = req.body;
//   const missedExams = JSON.stringify(d.missedExams || []);
//   const applicationType = Object.keys(d.applicationType)
//     .filter((k) => d.applicationType[k])
//     .join(",");
//   const sql = `
//     INSERT INTO CompassionateApplications (fullName, title, studentId, dob, telephone, email, address, year, campus, reason, appDate, filePath, applicationType, missedExams)
//     VALUES ('${d.fullName}', '${d.title}', '${d.Id}', '${d.dob}', '${d.telephone}', '${d.email}', '${d.address}', '${d.year || ""}', '${d.campus}', '${d.reason}', '${d.appDate}', '${d.filePath}', '${applicationType}', '${missedExams}')
//   `;
//   try {
//     await connection.execute(sql);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Resit
// router.post("/submit-resit", async (req, res) => {
//   const d = req.body;
//   const resitCourses = JSON.stringify(d.resitCourses || []);
//   const sql = `
//     INSERT INTO ResitApplications (fullName, title, studentId, dob, telephone, email, address, resitCourses)
//     VALUES ('${d.fullName}', '${d.title}', '${d.Id}', '${d.dob}', '${d.telephone}', '${d.email}', '${d.address}', '${resitCourses}')
//   `;
//   try {
//     await connection.execute(sql);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { Low } = require("lowdb");
// const { JSONFile } = require("lowdb/node");
// const path = require("path");

// // Setup LowDB JSON storage
// const file = path.join(__dirname, "form_data.json");
// const adapter = new JSONFile(file);
// const db = new Low(adapter);

// // Initialize DB with default structure if needed
// async function initDB() {
//   await db.read();
//   db.data ||= { graduation: [], compassionate: [], resit: [] };
//   await db.write();
// }

// initDB();

// // Graduation
// router.post("/submit-graduation", async (req, res) => {
//   try {
//     await db.read();
//     db.data.graduation.push(req.body);
//     await db.write();
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Compassionate
// router.post("/submit-compassionate", async (req, res) => {
//   try {
//     await db.read();
//     db.data.compassionate.push(req.body);
//     await db.write();
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Resit
// router.post("/submit-resit", async (req, res) => {
//   try {
//     await db.read();
//     db.data.resit.push(req.body);
//     await db.write();
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

// Setup LowDB JSON storage
const file = path.join(__dirname, "form_data.json");
const adapter = new FileSync(file);
const db = low(adapter);


const nodemailer = require("nodemailer");

// Setup transporter using your .env credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Initialize DB with default structure if needed
db.defaults({ graduation: [], compassionate: [], resit: [] }).write();

// Graduation
router.post("/submit-graduation", (req, res) => {
  try {
    db.get("graduation").push(req.body).write();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email, // student's email from the form
      subject: "Graduation Application Received",
      text: `Dear ${req.body.fullName},\n\nYour graduation application has been received.\n\nDetails:\nStudent ID: ${req.body.Id}\nProgram: ${req.body.program}\nGraduation Semester: ${req.body.gradSemester}\n\nThank you!`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email error:", err);
      else console.log("Confirmation email sent:", info.response);
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Compassionate
router.post("/submit-compassionate", (req, res) => {
  try {
    db.get("compassionate").push(req.body).write();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Compassionate Application Received",
      text: `Dear ${req.body.fullName},\n\nYour compassionate application has been received.\n\nDetails:\nStudent ID: ${req.body.Id}\nReason: ${req.body.reason}\n\nThank you!`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email error:", err);
      else console.log("Confirmation email sent:", info.response);
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resit
router.post("/submit-resit", (req, res) => {
  try {
    db.get("resit").push(req.body).write();

     // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Re-sit Application Received",
      text: `Dear ${req.body.fullName},\n\nYour resit application has been received.\n\nDetails:\nStudent ID: ${req.body.Id}\nResit Courses: ${JSON.stringify(req.body.resitCourses)}\n\nThank you!`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email error:", err);
      else console.log("Confirmation email sent:", info.response);
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();

// const upload = multer({
//   dest: path.join(__dirname, "../uploads"),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
// });

// // router.post("/upload-medical-doc", upload.single("document"), (req, res) => {
// //   if (!req.file) return res.status(400).json({ error: "No file uploaded" });
// //   res.json({ message: "File uploaded", filename: req.file.filename });
// // });
// router.post("/upload-medical-doc", upload.single("document"), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded" });
//   // You can return the relative path or just the filename
//   res.json({ filePath: `/uploads/${req.file.filename}` });
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

router.post("/upload-medical-doc", upload.single("document"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    message: "File uploaded successfully",
    file: {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    },
  });
});

module.exports = router

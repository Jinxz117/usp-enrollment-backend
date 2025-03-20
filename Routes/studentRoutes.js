const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");

// ✅ Get student details by user ID
router.get("/student/:id", studentController.getStudentById);

// ✅ Register a new student
router.post("/student/register", studentController.registerStudent);

module.exports = router;

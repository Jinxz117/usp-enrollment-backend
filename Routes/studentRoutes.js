const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");

// ✅ Get student details by user ID
router.get("/student/:id", studentController.getStudentById);

// ✅ Get student details by internal student ID
router.get("/student/by-id/:id", studentController.getStudentByStudentId);

// ✅ Register a new student
router.post("/student/register", studentController.registerStudent);

// ✅ Update hold status of a student
router.put("/student/hold/:id", studentController.updateHoldStatus);


router.get("/students", studentController.getAllStudents);
module.exports = router;

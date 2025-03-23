const express = require("express");
const router = express.Router();
const gradeController = require("../Controllers/gradeController");

// ✅ Get grades by student ID
router.get("/grades/:studentId", gradeController.getGradesByStudentId);

// ✅ Add a new grade
router.post("/grades/add", gradeController.addGrade);

module.exports = router;

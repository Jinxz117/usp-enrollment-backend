const express = require("express");
const router = express.Router();
const studentcoursesController = require("../Controllers/studentcoursesController");

router.get("/student-courses/:studentId", studentcoursesController.getStudentCourses);

router.get("/graduation-status/:studentId", studentcoursesController.getGraduationStatus);


module.exports = router;
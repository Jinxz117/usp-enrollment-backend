const express = require("express");
const router = express.Router();
const courseController = require("../Controllers/courseController");

// ✅ Get all courses
router.get("/courses", courseController.getAllCourses);

// ✅ Get a course by ID
router.get("/courses/:id", courseController.getCourseById);

// ✅ Create a new course
router.post("/courses", courseController.createCourse);

// ✅ Update a course
router.put("/courses/:id", courseController.updateCourse);

// ✅ Delete a course
router.delete("/courses/:id", courseController.deleteCourse);

module.exports = router;

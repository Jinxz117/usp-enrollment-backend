const express = require("express");
const router = express.Router();
const enrollmentController = require("../Controllers/enrollmentController");

// ✅ Get all enrollments
router.get("/enrollments", enrollmentController.getAllEnrollments);

// ✅ Get enrollments for a specific student
router.get("/enrollments/student/:student_id", enrollmentController.getEnrollmentsByStudent);

// ✅ Enroll a student in a course
router.post("/enrollments", enrollmentController.enrollStudent);

// ✅ Update enrollment status (e.g., mark as completed or dropped)
router.put("/enrollments/:id", enrollmentController.updateEnrollmentStatus);

// ✅ Delete an enrollment (drop course)
router.delete("/enrollments/:id", enrollmentController.deleteEnrollment);

module.exports = router;

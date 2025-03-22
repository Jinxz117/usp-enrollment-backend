const express = require("express");
const router = express.Router();
const enrollmentController = require("../Controllers/enrollmentController");

// Endpoint to get eligible courses for enrollment
router.get('/eligible-courses/:studentId', enrollmentController.getEligibleCoursesForEnrollment);

// ✅ Enroll student in a course
router.post("/enroll", enrollmentController.enrollStudent);

// ✅ Update enrollment status
router.put("/enrollment-status", enrollmentController.updateEnrollmentStatus);

// ✅ Get all enrollments for a student
router.get("/student/:student_id/enrollments", enrollmentController.getStudentEnrollments);

module.exports = router;

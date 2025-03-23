const express = require("express");
const router = express.Router();
const enrollmentController = require("../Controllers/enrollmentController");

// Endpoint to get eligible courses for program 
router.get('/program-courses/:studentId', enrollmentController.getEligibleCoursesForProgramRe);

// Endpoint to get eligible courses for enrollment
router.get('/eligible-courses/:studentId', enrollmentController.getEligibleCoursesForEnrollment);

// ✅ Enroll student in a course
router.post("/enroll", enrollmentController.enrollStudent);

// ✅ Update enrollment status
router.put("/enrollment-status", enrollmentController.updateEnrollmentStatus);

// ✅ Get all enrollments for a student
router.get("/student/:student_id/enrollments", enrollmentController.getStudentEnrollments);

//div
// Endpoint to delete an enrollment
router.delete("/enrollment/:enrollmentId", enrollmentController.deleteEnrollment);

module.exports = router;

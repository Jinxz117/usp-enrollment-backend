const EnrollmentModel = require("../Model/enrollmentModel");

// ✅ Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await EnrollmentModel.getAllEnrollments();
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get enrollments for a specific student
exports.getEnrollmentsByStudent = async (req, res) => {
  const { student_id } = req.params;
  try {
    const enrollments = await EnrollmentModel.getEnrollmentsByStudent(student_id);
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Enroll a student in a course
exports.enrollStudent = async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ message: "Missing student_id or course_id" });
  }

  try {
    const enrollmentId = await EnrollmentModel.enrollStudent(student_id, course_id);
    res.status(201).json({ message: "Enrollment successful", enrollmentId });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Failed to enroll student" });
  }
};

// ✅ Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["enrolled", "completed", "dropped"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updated = await EnrollmentModel.updateEnrollmentStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Enrollment not found or not updated" });

    res.json({ message: "Enrollment status updated successfully" });
  } catch (error) {
    console.error("Error updating enrollment status:", error);
    res.status(500).json({ message: "Failed to update enrollment status" });
  }
};

// ✅ Delete an enrollment (drop course)
exports.deleteEnrollment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await EnrollmentModel.deleteEnrollment(id);
    if (!deleted) return res.status(404).json({ message: "Enrollment not found or not deleted" });

    res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({ message: "Failed to delete enrollment" });
  }
};

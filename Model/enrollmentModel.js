const db = require("./db");

const EnrollmentModel = {
  // Register a new enrollment
  enrollStudentInCourse: async (student_id, course_id) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO enrollments (student_id, course_id, status) VALUES (?, ?, ?)",
        [student_id, course_id, 'enrolled']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Update enrollment status
  updateEnrollmentStatus: async (enrollment_id, status) => {
    try {
      const [result] = await db.execute(
        "UPDATE enrollments SET status = ? WHERE id = ?",
        [status, enrollment_id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // Get all enrollments for a student
  getEnrollmentsByStudentId: async (student_id) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM enrollments WHERE student_id = ?",
        [student_id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = EnrollmentModel;

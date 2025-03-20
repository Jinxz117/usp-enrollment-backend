const db = require("./db");

const EnrollmentModel = {
  // ✅ Get all enrollments
  getAllEnrollments: async () => {
    try {
      const [rows] = await db.execute(`
        SELECT e.id, e.student_id, e.course_id, e.enrollment_date, e.status,
               s.first_name, s.last_name, c.course_code, c.course_name
        FROM enrollments e
        JOIN students s ON e.student_id = s.id
        JOIN courses c ON e.course_id = c.id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Get enrollments for a specific student
  getEnrollmentsByStudent: async (student_id) => {
    try {
      const [rows] = await db.execute(
        `SELECT e.id, e.course_id, c.course_code, c.course_name, e.enrollment_date, e.status
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         WHERE e.student_id = ?`, [student_id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Enroll a student in a course
  enrollStudent: async (student_id, course_id) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
        [student_id, course_id]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Update enrollment status
  updateEnrollmentStatus: async (id, status) => {
    try {
      const [result] = await db.execute(
        "UPDATE enrollments SET status = ? WHERE id = ?",
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Drop (delete) an enrollment
  deleteEnrollment: async (id) => {
    try {
      const [result] = await db.execute("DELETE FROM enrollments WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = EnrollmentModel;

// const db = require("./db");

// const EnrollmentModel = {
//   // Register a new enrollment
//   enrollStudentInCourse: async (student_id, course_id) => {
//     try {
//       const [result] = await db.execute(
//         "INSERT INTO enrollments (student_id, course_id, status) VALUES (?, ?, ?)",
//         [student_id, course_id, 'enrolled']
//       );
//       return result.insertId;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update enrollment status
//   updateEnrollmentStatus: async (enrollment_id, status) => {
//     try {
//       const [result] = await db.execute(
//         "UPDATE enrollments SET status = ? WHERE id = ?",
//         [status, enrollment_id]
//       );
//       return result.affectedRows;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all enrollments for a student
//   getEnrollmentsByStudentId: async (student_id) => {
//     try {
//       const [rows] = await db.execute(
//         "SELECT * FROM enrollments WHERE student_id = ?",
//         [student_id]
//       );
//       return rows;
//     } catch (error) {
//       throw error;
//     }
//   },
//   //div
//   // Delete an enrollment
//   deleteEnrollment: async (enrollmentId) => {
//   try {
//     const [result] = await db.execute(
//       "DELETE FROM enrollments WHERE id = ?",
//       [enrollmentId]
//     );
//     return result.affectedRows;
//   } catch (error) {
//     throw error;
//   }
// },
// };


// module.exports = EnrollmentModel;

const db = require("./db");

const EnrollmentModel = {
  // ✅ Register a new enrollment
  enrollStudentInCourse: async (student_id, course_id) => {
    try {
      const query = "INSERT INTO enrollments (student_id, course_id, status) VALUES (?, ?, ?)";
      const [result] = await db.query(query, [student_id, course_id, "enrolled"]); // Use db.query
      return result.insertId; // Return the ID of the newly created enrollment
    } catch (error) {
      console.error("Error enrolling student in course:", error);
      throw { code: "ENROLL_STUDENT_ERROR", message: "Failed to enroll student in course", details: error.message };
    }
  },

  // ✅ Update enrollment status
  updateEnrollmentStatus: async (enrollment_id, status) => {
    try {
      const query = "UPDATE enrollments SET status = ? WHERE id = ?";
      const [result] = await db.query(query, [status, enrollment_id]); // Use db.query
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error("Error updating enrollment status:", error);
      throw { code: "UPDATE_ENROLLMENT_ERROR", message: "Failed to update enrollment status", details: error.message };
    }
  },

  // ✅ Get all enrollments for a student
  getEnrollmentsByStudentId: async (student_id) => {
    try {
      const query = "SELECT * FROM enrollments WHERE student_id = ?";
      const [rows] = await db.query(query, [student_id]); // Use db.query
      return rows; // Return all enrollments as an array
    } catch (error) {
      console.error("Error fetching enrollments by student ID:", error);
      throw { code: "GET_ENROLLMENTS_ERROR", message: "Failed to fetch enrollments", details: error.message };
    }
  },

  // ✅ Delete an enrollment
  deleteEnrollment: async (enrollmentId) => {
    try {
      const query = "DELETE FROM enrollments WHERE id = ?";
      const [result] = await db.query(query, [enrollmentId]); // Use db.query
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      throw { code: "DELETE_ENROLLMENT_ERROR", message: "Failed to delete enrollment", details: error.message };
    }
  },
};

module.exports = EnrollmentModel;
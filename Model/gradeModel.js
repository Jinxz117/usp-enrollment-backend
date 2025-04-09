// const db = require("./db");

// const GradeModel = {
//   // Get grades by student ID
//   /* getGradesByStudentId: async (studentId) => {
//     try {
//       const query = `
//         SELECT grades.*, course.course_code, course.course_name
//         FROM grades
//         JOIN courses ON grades.course_id = course.id
//         WHERE grades.id = ?
        
//       `;
      
//       const [rows] = await db.execute(query, [studentId]);
//       return rows;
//     } catch (error) {
//       throw error;
//     }
//   }, */

  


//   getGradesByStudentId: async (studentId) => {
//     try {
//       const query = `
//         SELECT 
//           g.grade, 
//           g.year, 
//           g.semester, 
//           c.course_code, 
//           c.course_name
//         FROM 
//           grades g
//         JOIN 
//           courses c ON g.course_id = c.id
//         WHERE 
//           g.student_id = ?;
//       `;
      
//       // Execute the query and pass the studentId as a parameter
//       const [rows] = await db.execute(query, [studentId]);
//       return rows;
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   // Add a new grade entry
//   addGrade: async (studentId, courseId, grade) => {
//     try {
//       const query = "INSERT INTO grades (student_id, course_id, grade) VALUES (?, ?, ?)";
//       const [result] = await db.execute(query, [studentId, courseId, grade]);
//       return result.insertId;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// module.exports = GradeModel;


const db = require("./db");

const GradeModel = {
  // ✅ Get grades by student ID
  getGradesByStudentId: async (studentId) => {
    try {
      const query = `
        SELECT 
          g.grade, 
          g.year, 
          g.semester, 
          c.course_code, 
          c.course_name
        FROM 
          grades g
        JOIN 
          courses c ON g.course_id = c.id
        WHERE 
          g.student_id = ?;
      `;

      const [rows] = await db.query(query, [studentId]); // Use db.query
      return rows; // Return all grades as an array (even if empty)
    } catch (error) {
      console.error("Error fetching grades by student ID:", error);
      throw { code: "GET_GRADES_ERROR", message: "Failed to fetch grades", details: error.message };
    }
  },

  // ✅ Add a new grade entry
  addGrade: async (studentId, courseId, grade) => {
    try {
      const query = "INSERT INTO grades (student_id, course_id, grade) VALUES (?, ?, ?)";
      const [result] = await db.query(query, [studentId, courseId, grade]); // Use db.query
      return result.insertId; // Return the ID of the newly inserted grade
    } catch (error) {
      console.error("Error adding grade:", error);
      throw { code: "ADD_GRADE_ERROR", message: "Failed to add grade", details: error.message };
    }
  },

  // ✅ Update a grade entry
  updateGrade: async (gradeId, grade) => {
    try {
      const query = "UPDATE grades SET grade = ? WHERE id = ?";
      const [result] = await db.query(query, [grade, gradeId]); // Use db.query

      if (result.affectedRows === 0) {
        return null; // No grade found to update
      }

      return { message: "Grade updated successfully" };
    } catch (error) {
      console.error("Error updating grade:", error);
      throw { code: "UPDATE_GRADE_ERROR", message: "Failed to update grade", details: error.message };
    }
  },

  // ✅ Delete a grade entry
  deleteGrade: async (gradeId) => {
    try {
      const query = "DELETE FROM grades WHERE id = ?";
      const [result] = await db.query(query, [gradeId]); // Use db.query

      if (result.affectedRows === 0) {
        return null; // No grade found to delete
      }

      return { message: "Grade deleted successfully" };
    } catch (error) {
      console.error("Error deleting grade:", error);
      throw { code: "DELETE_GRADE_ERROR", message: "Failed to delete grade", details: error.message };
    }
  },
};

module.exports = GradeModel;
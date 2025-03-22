const db = require("./db");

const StudentModel = {
  // Get student by user ID
  getStudentByUserId: async (studentId) => {
    try {
      const query = `
        SELECT students.*, program_name AS program_name 
        FROM students 
        JOIN programs ON students.program_id = program_id 
        WHERE students.user_id = ?;
      `;
      
      const [rows] = await db.execute(query, [studentId]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },

  
};

exports.getStudentByUserId = async (userId) => {
    try {
      const [rows] = await db.execute("SELECT * FROM students WHERE user_id = ?", [userId]);
      return rows.length > 0 ? rows[0] : null; // Return student data or null if not found
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  };
  
module.exports = StudentModel;

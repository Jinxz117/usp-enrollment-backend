const db = require("./db");

const StudentModel = {
  // Get student by user ID
  getStudentByUserId: async (userId) => {
    try {
      const [rows] = await db.execute("SELECT * FROM students WHERE user_id = ?", [userId]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // Register a new student
  registerStudent: async (userId, first_name, last_name, dob, email, phone, program) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO students (user_id, first_name, last_name, dob, email, phone, program) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, first_name, last_name, dob, email, phone, program]
      );
      return result.insertId;
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

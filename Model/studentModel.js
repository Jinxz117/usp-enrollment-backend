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

  // Register a new student
  registerStudent: async (userId, first_name, last_name, dob, email, phone, program_id) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO students (user_id, first_name, last_name, dob, email, phone, program_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, first_name, last_name, dob, email, phone, program_id]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = StudentModel;

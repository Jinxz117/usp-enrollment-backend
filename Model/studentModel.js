// const db = require("./db");

// const StudentModel = {
//   // Get student by user ID
//   getStudentByUserId: async (studentId) => {
//     try {
//       const query = `
//         SELECT students.*, program_name AS program_name 
//         FROM students 
//         JOIN programs ON students.program_id = program_id 
//         WHERE students.user_id = ?;
//       `;
      
//       const [rows] = await db.execute(query, [studentId]);
      
//       return rows.length ? rows[0] : null;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Register a new student
//   registerStudent: async (userId, first_name, last_name, dob, email, phone, program_id) => {
//     try {
//       const [result] = await db.execute(
//         "INSERT INTO students (user_id, first_name, last_name, dob, email, phone, program_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
//         [userId, first_name, last_name, dob, email, phone, program_id]
//       );
//       return result.insertId;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

// module.exports = StudentModel;


const db = require("./db");

const StudentModel = {
  getStudentByStudentId: async (studentId) => {
    try {
      const query = `
        SELECT students.*, program_name AS program_name 
        FROM students 
        JOIN programs ON students.program_id = program_id 
        WHERE students.id = ?;
      `;

      const [rows] = await db.query(query, [studentId]);

      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Error fetching student by student ID:", error);
      throw { code: "GET_STUDENT_BY_STUDENT_ID_ERROR", message: "Failed to fetch student by student ID", details: error.message };
    }
  },
  // ✅ Get student by user ID
  getStudentByUserId: async (studentId) => {
    try {
      const query = `
        SELECT students.*, program_name AS program_name 
        FROM students 
        JOIN programs ON students.program_id = program_id 
        WHERE students.user_id = ?;
      `;

      const [rows] = await db.query(query, [studentId]); // Use db.query instead of db.execute

      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Error fetching student by user ID:", error);
      throw { code: "GET_STUDENT_BY_ID_ERROR", message: "Failed to fetch student by user ID", details: error.message };
    }
  },

  // ✅ Register a new student
  registerStudent: async (userId, first_name, last_name, dob, email, phone, program_id) => {
    try {
      const query = `
        INSERT INTO students (user_id, first_name, last_name, dob, email, phone, program_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(query, [userId, first_name, last_name, dob, email, phone, program_id]); // Use db.query

      return result.insertId;
    } catch (error) {
      console.error("Error registering student:", error);
      throw { code: "REGISTER_STUDENT_ERROR", message: "Failed to register student", details: error.message };
    }
  },

  getAllStudents: async () => {
    try {
      const query = `
        SELECT *
        FROM students
        
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching all students:", error);
      throw { code: "GET_ALL_STUDENTS_ERROR", message: "Failed to fetch all students", details: error.message };
    }
  },
  updateHoldStatus: async (studentId, is_hold, hold_type) => {
    try {
      const query = `
        UPDATE students
        SET is_hold = ?, hold_type = ?
        WHERE id = ?;
      `;
      const [result] = await db.query(query, [is_hold, hold_type, studentId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating hold status:", error);
      throw { code: "UPDATE_HOLD_STATUS_ERROR", message: "Failed to update hold status", details: error.message };
    }
  },
};

module.exports = StudentModel;
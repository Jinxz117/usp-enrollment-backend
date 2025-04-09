// const db = require("./db");

// const ProgramRequirementModel = {
//   // Get all program requirements
//   getAll: async () => {
//     const query = "SELECT * FROM program_requirements";
//     const [rows] = await db.execute(query);
//     return rows;
//   },

//   // Get program requirements by program_id
//   getByProgramId: async (programId) => {
//     const query = "SELECT * FROM program_requirements WHERE program_id = ?";
//     const [rows] = await db.execute(query, [programId]);
//     return rows;
//   },

//   // Add a new program requirement
//   add: async (programId, courseCode, prerequisiteCourseCode) => {
//     const query = `
//       INSERT INTO program_requirements (program_id, course_code, prerequisite_course_code) 
//       VALUES (?, ?, ?)`;
//     const [result] = await db.execute(query, [programId, courseCode, prerequisiteCourseCode]);
//     return result;
//   },

//   // Delete a program requirement
//   delete: async (id) => {
//     const query = "DELETE FROM program_requirements WHERE id = ?";
//     const [result] = await db.execute(query, [id]);
//     return result;
//   }
// };

// module.exports = ProgramRequirementModel;

const db = require("./db");

const ProgramRequirementModel = {
  // ✅ Get all program requirements
  getAll: async () => {
    try {
      const query = "SELECT * FROM program_requirements";
      const [rows] = await db.query(query); // Use db.query
      return rows; // Return all program requirements as an array
    } catch (error) {
      console.error("Error fetching all program requirements:", error);
      throw { code: "GET_PROGRAM_REQUIREMENTS_ERROR", message: "Failed to fetch program requirements", details: error.message };
    }
  },

  // ✅ Get program requirements by program_id
  getByProgramId: async (programId) => {
    try {
      const query = "SELECT * FROM program_requirements WHERE program_id = ?";
      const [rows] = await db.query(query, [programId]); // Use db.query
      return rows; // Return program requirements for the given program_id
    } catch (error) {
      console.error("Error fetching program requirements by program ID:", error);
      throw { code: "GET_PROGRAM_REQUIREMENTS_BY_ID_ERROR", message: "Failed to fetch program requirements", details: error.message };
    }
  },

  // ✅ Add a new program requirement
  add: async (programId, courseCode, prerequisiteCourseCode) => {
    try {
      const query = `
        INSERT INTO program_requirements (program_id, course_code, prerequisite_course_code) 
        VALUES (?, ?, ?)
      `;
      const [result] = await db.query(query, [programId, courseCode, prerequisiteCourseCode]); // Use db.query
      return result.insertId; // Return the ID of the newly created program requirement
    } catch (error) {
      console.error("Error adding program requirement:", error);
      throw { code: "ADD_PROGRAM_REQUIREMENT_ERROR", message: "Failed to add program requirement", details: error.message };
    }
  },

  // ✅ Delete a program requirement
  delete: async (id) => {
    try {
      const query = "DELETE FROM program_requirements WHERE id = ?";
      const [result] = await db.query(query, [id]); // Use db.query
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error("Error deleting program requirement:", error);
      throw { code: "DELETE_PROGRAM_REQUIREMENT_ERROR", message: "Failed to delete program requirement", details: error.message };
    }
  },
};

module.exports = ProgramRequirementModel;
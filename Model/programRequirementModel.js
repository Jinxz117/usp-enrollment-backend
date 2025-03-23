const db = require("./db");

const ProgramRequirementModel = {
  // Get all program requirements
  getAll: async () => {
    const query = "SELECT * FROM program_requirements";
    const [rows] = await db.execute(query);
    return rows;
  },

  // Get program requirements by program_id
  getByProgramId: async (programId) => {
    const query = "SELECT * FROM program_requirements WHERE program_id = ?";
    const [rows] = await db.execute(query, [programId]);
    return rows;
  },

  // Add a new program requirement
  add: async (programId, courseCode, prerequisiteCourseCode) => {
    const query = `
      INSERT INTO program_requirements (program_id, course_code, prerequisite_course_code) 
      VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [programId, courseCode, prerequisiteCourseCode]);
    return result;
  },

  // Delete a program requirement
  delete: async (id) => {
    const query = "DELETE FROM program_requirements WHERE id = ?";
    const [result] = await db.execute(query, [id]);
    return result;
  }
};

module.exports = ProgramRequirementModel;

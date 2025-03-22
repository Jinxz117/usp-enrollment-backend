const db = require("./db");

const GradeModel = {
  // Get grades by student ID
  /* getGradesByStudentId: async (studentId) => {
    try {
      const query = `
        SELECT grades.*, course.course_code, course.course_name
        FROM grades
        JOIN courses ON grades.course_id = course.id
        WHERE grades.id = ?
        
      `;
      
      const [rows] = await db.execute(query, [studentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }, */

  


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
      
      // Execute the query and pass the studentId as a parameter
      const [rows] = await db.execute(query, [studentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a new grade entry
  addGrade: async (studentId, courseId, grade) => {
    try {
      const query = "INSERT INTO grades (student_id, course_id, grade) VALUES (?, ?, ?)";
      const [result] = await db.execute(query, [studentId, courseId, grade]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = GradeModel;

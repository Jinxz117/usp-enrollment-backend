const db = require("../Model/db");

exports.getStudentCourses = async (req, res) => {
  const studentId = req.params.studentId;
  try {
    // Debug columns (optional - can be removed later)
    const [columns] = await db.query("SHOW COLUMNS FROM enrollments");
    console.log("Enrollments table columns:", columns);

    // Use .query instead of .execute
    const [rows] = await db.query(
      `SELECT DISTINCT c.id AS course_id, c.course_name
       FROM usp_enrollment.courses c
       LEFT JOIN usp_enrollment.enrollments e 
         ON c.id = e.course_id AND e.student_id = ?
       LEFT JOIN usp_enrollment.grades g 
         ON c.id = g.course_id AND g.student_id = ?
       WHERE e.id IS NOT NULL
          OR g.grade IN ('D', 'E', 'F')`,
      [studentId, studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error in getStudentCourses:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};



// check if student has completed all courses for graduation
exports.getGraduationStatus = async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const [rows] = await db.query(
      `SELECT 
          s.id AS student_id,
          CONCAT(s.first_name, ' ', s.last_name) AS student_name,
          p.program_name,
          CASE 
              WHEN COUNT(DISTINCT pr.course_code) = COUNT(DISTINCT CASE 
                                                                      WHEN g.grade > 'D' THEN c.course_code 
                                                                    END)
              THEN 'Completed All Courses'
              ELSE 'Not Completed All Courses'
          END AS completion_status
      FROM 
          usp_enrollment.students s
      JOIN 
          usp_enrollment.programs p ON s.program_id = p.id
      JOIN 
          usp_enrollment.program_requirements pr ON p.id = pr.program_id
      JOIN 
          usp_enrollment.courses c ON pr.course_code = c.course_code
      LEFT JOIN 
          usp_enrollment.grades g ON g.student_id = s.id AND g.course_id = c.id
      WHERE 
          s.id = ?
      GROUP BY 
          s.id, s.first_name, s.last_name, p.program_name;`,
      [studentId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Error in getGraduationStatus:", err.message, err.stack);
    res.status(500).json({ error: "Failed to check graduation status" });
  }
};

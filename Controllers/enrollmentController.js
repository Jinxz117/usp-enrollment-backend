const EnrollmentModel = require("../Model/enrollmentModel");
const { pool } = require('../Model/db');

// ✅ Get eligible courses for programs re
exports.getEligibleCoursesForProgramRe = async (req, res) => {
  const studentId = req.params.studentId;  // Retrieve student ID from URL parameter

  const query = `
    WITH student_courses AS (
      SELECT 
        g.student_id, 
        g.course_id, 
        c.course_code, 
        c.course_name,
        g.grade, 
        g.status
      FROM grades g
      JOIN courses c ON g.course_id = c.id
      WHERE g.status = 'Pass'
    ),
    needed_courses AS (
      SELECT 
        pr.program_id, 
        pr.course_code, 
        pr.prerequisite_course_code
      FROM program_requirements pr
    ),
    enrolled_courses AS (
      SELECT 
        e.student_id, 
        c.course_code, 
        e.status AS enrollment_status
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
    )
    SELECT 
      s.id AS student_id,
      s.first_name,
      s.last_name,
      p.program_name,
      nc.course_code AS course,
      c.course_name AS course_name,
      nc.prerequisite_course_code AS prerequisite_course,
      c.prerequisite AS prerequisite_course_name,
      CASE 
          WHEN sc.course_code IS NOT NULL THEN 'Completed'
          WHEN ec.enrollment_status = 'enrolled' THEN 'Enrolled'
          WHEN nc.prerequisite_course_code IS NOT NULL AND scp.course_code IS NULL THEN 'Prerequisite Not Met'
          ELSE 'Pending'
      END AS status
    FROM students s
    JOIN programs p ON s.program_id = p.id
    JOIN needed_courses nc ON nc.program_id = s.program_id
    LEFT JOIN student_courses sc ON sc.student_id = s.id AND sc.course_code = nc.course_code
    LEFT JOIN student_courses scp ON scp.student_id = s.id AND scp.course_code = nc.prerequisite_course_code
    LEFT JOIN enrolled_courses ec ON ec.student_id = s.id AND ec.course_code = nc.course_code
    LEFT JOIN courses c ON c.course_code = nc.course_code
    WHERE s.id = ? 
    ORDER BY nc.course_code;
  `;

  try {
    const [rows] = await pool.promise().query(query, [studentId]);
    res.json(rows);  // Return the data to the frontend
  } catch (error) {
    console.error("Error fetching eligible courses:", error);
    res.status(500).json({ error: "Failed to fetch eligible courses" });
  }
};

// ✅ Enroll student in a course
exports.enrollStudent = async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ error: "Student ID and Course ID are required" });
  }

  try {
    const enrollmentId = await EnrollmentModel.enrollStudentInCourse(student_id, course_id);
    res.status(201).json({ message: "Student enrolled successfully", enrollmentId });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Failed to enroll student" });
  }
};

// ✅ Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  const { enrollment_id, status } = req.body;

  if (!enrollment_id || !status) {
    return res.status(400).json({ error: "Enrollment ID and status are required" });
  }

  if (!['enrolled', 'completed', 'dropped'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const affectedRows = await EnrollmentModel.updateEnrollmentStatus(enrollment_id, status);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json({ message: "Enrollment status updated successfully" });
  } catch (error) {
    console.error("Error updating enrollment status:", error);
    res.status(500).json({ message: "Failed to update enrollment status" });
  }
};


/*
// ✅ Get all enrollments of a student
exports.getStudentEnrollments = async (req, res) => {
  const student_id = req.params.student_id;

  if (!student_id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    const enrollments = await EnrollmentModel.getEnrollmentsByStudentId(student_id);
    if (enrollments.length === 0) {
      return res.status(404).json({ message: "No enrollments found for this student" });
    }
    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
*/


// ✅ Get all enrollments of a student with course details
exports.getStudentEnrollments = async (req, res) => {
  const student_id = req.params.student_id;

  if (!student_id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  // Modified query to include course details (course_code and course_name)
  const query = `
    SELECT 
      e.id AS enrollment_id,
      e.status AS enrollment_status,
      c.course_code,
      c.course_name
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
  `;

  try {
    const [rows] = await pool.promise().query(query, [student_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No enrollments found for this student" });
    }
    res.status(200).json(rows);  // Return enrollments with course details
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get eligible course for enrollments
exports.getEligibleCoursesForEnrollment = async (req, res) => {
  const studentId = req.params.studentId;  // Retrieve student ID from URL parameter

  const query = `
    WITH student_courses AS (
      SELECT 
          g.student_id, 
          g.course_id, 
          c.course_code, 
          c.course_name,  -- Include course_name here
          g.grade, 
          g.status
      FROM grades g
      JOIN courses c ON g.course_id = c.id
      WHERE g.status = 'Pass'
    ),
    needed_courses AS (
      SELECT 
          pr.program_id, 
          pr.course_code, 
          pr.prerequisite_course_code
      FROM program_requirements pr
    )
    SELECT 
        s.id AS student_id,
        s.first_name,
        s.last_name,
        p.program_name,
        c.id AS course_id,
        c.course_code AS course,
        c.course_name,   -- Include course_name in the final select
        nc.prerequisite_course_code AS prerequisite_course,
        'Pending' AS status
    FROM students s
    JOIN programs p ON s.program_id = p.id
    JOIN needed_courses nc ON nc.program_id = s.program_id
    JOIN courses c ON c.course_code = nc.course_code
    LEFT JOIN student_courses sc ON sc.student_id = s.id AND sc.course_code = nc.course_code
    LEFT JOIN student_courses scp ON scp.student_id = s.id AND scp.course_code = nc.prerequisite_course_code
    WHERE s.id = ? 
      AND sc.course_code IS NULL 
      AND (nc.prerequisite_course_code IS NULL OR scp.course_code IS NOT NULL)
    ORDER BY nc.course_code;
  `;

  try {
    const [rows] = await pool.promise().query(query, [studentId]);
    res.json(rows);  // Return the data to the frontend
  } catch (error) {
    console.error("Error fetching eligible courses:", error);
    res.status(500).json({ error: "Failed to fetch eligible courses" });
  }
};


// div
exports.deleteEnrollment = async (req, res) => {
  const enrollmentId = req.params.enrollmentId;

  if (!enrollmentId) {
    return res.status(400).json({ error: "Enrollment ID is required" });
  }

  try {
    const affectedRows = await EnrollmentModel.deleteEnrollment(enrollmentId);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({ message: "Failed to delete enrollment" });
  }
};
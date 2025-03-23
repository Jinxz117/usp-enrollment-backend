const gradeModel = require("../Model/gradeModel");

// ✅ Get grades by student ID
exports.getGradesByStudentId = async (req, res) => {

  try {
    const {studentId} = req.params; // Get student ID from request params
    const grades = await gradeModel.getGradesByStudentId(studentId);


    if (grades.length === 0) {
      return res.status(404).json({ message: "No grades found for this student" });
    }

    res.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a grade entry
exports.addGrade = async (req, res) => {
  const { student_id, course_id, grade } = req.body;

  if (!student_id || !course_id || !grade) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const gradeId = await GradesModel.addGrade(student_id, course_id, grade);
    res.status(201).json({ message: "Grade added successfully", gradeId });
  } catch (error) {
    console.error("Error adding grade:", error);
    res.status(500).json({ message: "Failed to add grade" });
  }
};

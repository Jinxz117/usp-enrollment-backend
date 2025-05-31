const StudentModel = require("../Model/studentModel");


// ✅ Get student details based on internal student ID from request params
exports.getStudentByStudentId = async (req, res) => {
  const studentId = req.params.id; // Get student ID from request params

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required", code: "STUDENT_ID_REQUIRED" });
  }

  try {
    const student = await StudentModel.getStudentByStudentId(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found", code: "STUDENT_NOT_FOUND" });
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student by student ID:", error);
    res.status(500).json({ message: "Server error", code: "GET_STUDENT_BY_STUDENT_ID_ERROR" });
  }
};
// ✅ Get student details based on user ID from request params
exports.getStudentById = async (req, res) => {
  const userId = req.params.id; // Get user ID from request params

  if (!userId) {
    return res.status(400).json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
  }

  try {
    const student = await StudentModel.getStudentByUserId(userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found", code: "STUDENT_NOT_FOUND" });
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student2 data:", error);
    console.log("Executing SQL Query for user ID:", userId);

    res.status(500).json({ message: "Server error", code: "GET_STUDENT_ERROR" });
  }
};

// ✅ Register a new student
exports.registerStudent = async (req, res) => {
  const { user_id, first_name, last_name, dob, email, phone, program_id } = req.body;

  if (!user_id || !first_name || !last_name || !dob || !email) {
    return res.status(400).json({ error: "Missing required fields", code: "MISSING_FIELDS" });
  }

  try {
    const studentId = await StudentModel.registerStudent(user_id, first_name, last_name, dob, email, phone, program_id);
    res.status(201).json({ message: "Student registered successfully", studentId });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Failed to register student", code: "STUDENT_REGISTRATION_ERROR" });
  }
};

// ✅ Update student hold status
exports.updateHoldStatus = async (req, res) => {
  const { id } = req.params;
  const { is_hold, hold_type } = req.body;

  if (!id || typeof is_hold === "undefined" || typeof hold_type === "undefined") {
    return res.status(400).json({ message: "id, is_hold, and hold_type are required", code: "MISSING_FIELDS" });
  }

  try {
    const updated = await StudentModel.updateHoldStatus(id, is_hold, hold_type);
    if (!updated) {
      return res.status(404).json({ message: "Student not found", code: "STUDENT_NOT_FOUND" });
    }
    res.json({ message: "Hold status updated successfully" });
  } catch (error) {
    console.error("Error updating hold status:", error);
    res.status(500).json({ message: "Error updating hold status", code: "UPDATE_HOLD_STATUS_ERROR" });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Error fetching all students:", error);
    res.status(500).json({ message: "Failed to fetch all students", code: "GET_ALL_STUDENTS_ERROR" });
  }
};

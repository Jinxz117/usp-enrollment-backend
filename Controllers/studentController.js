const StudentModel = require("../Model/studentmodel");

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

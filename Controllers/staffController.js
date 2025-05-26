const StaffModel = require("../Model/staffModel");

// ✅ Get Staff details based on user ID from request params
exports.getStaffById = async (req, res) => {
  const userId = req.params.id; // Get user ID from request params

  if (!userId) {
    return res.status(400).json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
  }

  try {
    const staff = await StaffModel.getStaffByUserId(userId);

    if (!staff) {
      return res.status(404).json({ message: "STAFF not found", code: "STAFF_NOT_FOUND" });
    }

    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff data:", error);
    console.log("Executing SQL Query for user ID:", userId);

    res.status(500).json({ message: "Server error", code: "GET_STAFF_ERROR" });
  }
};

// // ✅ Register a new staff
// exports.registerStaff = async (req, res) => {
//   const { user_id, first_name, last_name, dob, email, phone } = req.body;

//   if (!user_id || !first_name || !last_name || !email) {
//     return res.status(400).json({ error: "Missing required fields", code: "MISSING_FIELDS" });
//   }

//   try {
//     const staffId = await StaffModel.registerStaff(user_id, first_name, last_name, email, phone);
//     res.status(201).json({ message: "Staff registered successfully", staffId });
//   } catch (error) {
//     console.error("Error registering staff:", error);
//     res.status(500).json({ message: "Failed to register STAFF", code: "STAFF_REGISTRATION_ERROR" });
//   }
// };
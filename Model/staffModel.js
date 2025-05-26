const db = require("./db");

const StaffModel = {
  // ✅ Get student by user ID
  getStaffByUserId: async (staffId) => {
    try {
      const query = `
        SELECT * FROM staff
        WHERE staff.user_id = ?;
      `;

      const [rows] = await db.query(query, [staffId]); // Use db.query instead of db.execute

      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Error fetching staff by user ID:", error);
      throw { code: "GET_STAFF_BY_ID_ERROR", message: "Failed to fetch staff by user ID", details: error.message };
    }
  },
};

module.exports = StaffModel;
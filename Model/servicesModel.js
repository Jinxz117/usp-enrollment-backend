const db = require("./db");

const ServicesModel = {

    updateServiceAvailableStatus: async (studentId, serviceId, serviceAvailable) => {
  try {
    const query = `
      UPDATE student_services
      SET service_available = ?
      WHERE student_id = ? AND service_id = ?;
    `;
    const [result] = await db.query(query, [serviceAvailable, studentId, serviceId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating service_available status:", error);
    throw { code: "UPDATE_SERVICE_AVAILABLE_ERROR", message: "Failed to update service status", details: error.message };
  }
},
  // ✅ Get services by student ID
  getServicesByStudentId: async (studentId) => {
    try {
      const query = `
        SELECT student_services.*, s.service_name
        FROM student_services
        JOIN students ON student_services.student_id = students.id
        JOIN services s ON student_services.service_id = s.id
        WHERE students.id = ?;
      `;
      const [rows] = await db.query(query, [studentId]);
      return rows; // Return all services as an array (even if empty)
    } catch (error) {
      console.error("Error fetching services by student ID:", error);
      throw { code: "GET_SERVICES_BY_STUDENT_ID_ERROR", message: "Failed to fetch services", details: error.message };
    }
  },
};



module.exports = ServicesModel;
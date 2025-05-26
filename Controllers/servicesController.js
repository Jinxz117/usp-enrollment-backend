const ServicesModel = require("../Model/servicesModel");

// ✅ Get services for a student by user ID
exports.getServicesByStudentId = async (req, res) => {
  const studentId = req.params.studentId; // Get student ID from request params

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required", code: "STUDENT_ID_REQUIRED" });
  }

  try {
    const services = await ServicesModel.getServicesByStudentId(studentId);

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found for this student", code: "SERVICES_NOT_FOUND" });
    }

    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Error fetching services", code: "GET_SERVICES_ERROR" });
  }
};

exports.updateServiceAvailableStatus = async (req, res) => {
  const { studentId, serviceId } = req.params;
  const { service_available } = req.body;

  if (!studentId || !serviceId || typeof service_available === "undefined") {
    return res.status(400).json({ message: "studentId, serviceId, and service_available are required", code: "MISSING_FIELDS" });
  }

  try {
    const updated = await ServicesModel.updateServiceAvailableStatus(studentId, serviceId, service_available);
    if (!updated) {
      return res.status(404).json({ message: "Service record not found", code: "SERVICE_NOT_FOUND" });
    }
    res.json({ message: "Service status updated successfully" });
  } catch (error) {
    console.error("Error updating service status:", error);
    res.status(500).json({ message: "Error updating service status", code: "UPDATE_SERVICE_ERROR" });
  }
};
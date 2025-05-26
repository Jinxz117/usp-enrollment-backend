const express = require("express");
const router = express.Router();
const servicesController = require("../Controllers/servicesController");

// ✅ Get services for a student by user ID
router.get("/services/:studentId", servicesController.getServicesByStudentId);
// Add this route below your existing GET route
router.put("/services/:studentId/:serviceId", servicesController.updateServiceAvailableStatus);

module.exports = router;
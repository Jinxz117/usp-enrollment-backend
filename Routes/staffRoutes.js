const express = require("express");
const router = express.Router();
const staffController = require("../Controllers/staffController");

router.get("/staff/:id", staffController.getStaffById);

module.exports = router;
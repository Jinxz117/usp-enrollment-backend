const express = require("express");
const router = express.Router();

const formsController = require("../Controllers/formsController");

router.get("/graduation", formsController.getAllGraduation);
router.get("/compassionate", formsController.getAllCompassionate);
router.get("/resit", formsController.getAllResit);

router.post("/decision", formsController.handleDecision);

module.exports = router;

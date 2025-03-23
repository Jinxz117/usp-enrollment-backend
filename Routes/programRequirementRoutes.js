const express = require("express");
const router = express.Router();
const ProgramRequirementController = require("../Controllers/programRequirementController");

// Get all program requirements
router.get("/", ProgramRequirementController.getAll);

// Get program requirements by program_id
router.get("/:programId", ProgramRequirementController.getByProgramId);

// Add a new program requirement
router.post("/", ProgramRequirementController.add);

// Delete a program requirement
router.delete("/:id", ProgramRequirementController.delete);

module.exports = router;

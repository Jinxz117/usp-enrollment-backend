const ProgramRequirementModel = require("../Model/programRequirementModel");

const ProgramRequirementController = {
  // Get all program requirements
  getAll: async (req, res) => {
    try {
      const data = await ProgramRequirementModel.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // Get program requirements by program_id
  getByProgramId: async (req, res) => {
    try {
      const { programId } = req.params;
      const data = await ProgramRequirementModel.getByProgramId(programId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // Add a new program requirement
  add: async (req, res) => {
    try {
      const { programId, courseCode, prerequisiteCourseCode } = req.body;
      await ProgramRequirementModel.add(programId, courseCode, prerequisiteCourseCode);
      res.json({ message: "Program requirement added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // Delete a program requirement
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await ProgramRequirementModel.delete(id);
      res.json({ message: "Program requirement deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
};

module.exports = ProgramRequirementController;

// const ProgramRequirementModel = require("../Model/programRequirementModel");

// const ProgramRequirementController = {
//   // Get all program requirements
//   getAll: async (req, res) => {
//     try {
//       const data = await ProgramRequirementModel.getAll();
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   },

//   // Get program requirements by program_id
//   getByProgramId: async (req, res) => {
//     try {
//       const { programId } = req.params;
//       const data = await ProgramRequirementModel.getByProgramId(programId);
//       res.json(data);
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   },

//   // Add a new program requirement
//   add: async (req, res) => {
//     try {
//       const { programId, courseCode, prerequisiteCourseCode } = req.body;
//       await ProgramRequirementModel.add(programId, courseCode, prerequisiteCourseCode);
//       res.json({ message: "Program requirement added successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   },

//   // Delete a program requirement
//   delete: async (req, res) => {
//     try {
//       const { id } = req.params;
//       await ProgramRequirementModel.delete(id);
//       res.json({ message: "Program requirement deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   }
// };

// module.exports = ProgramRequirementController;

const ProgramRequirementModel = require("../Model/programRequirementModel");

const ProgramRequirementController = {
  // ✅ Get all program requirements
  getAll: async (req, res) => {
    try {
      const data = await ProgramRequirementModel.getAll();
      res.json(data);
    } catch (error) {
      console.error("Error fetching all program requirements:", error);
      res.status(500).json({ message: "Failed to fetch program requirements", code: "GET_PROGRAM_REQUIREMENTS_ERROR" });
    }
  },

  // ✅ Get program requirements by program_id
  getByProgramId: async (req, res) => {
    const { programId } = req.params;

    if (!programId) {
      return res.status(400).json({ message: "Program ID is required", code: "PROGRAM_ID_REQUIRED" });
    }

    try {
      const data = await ProgramRequirementModel.getByProgramId(programId);

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No program requirements found", code: "PROGRAM_REQUIREMENTS_NOT_FOUND" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching program requirements by program ID:", error);
      res.status(500).json({ message: "Failed to fetch program requirements", code: "GET_PROGRAM_REQUIREMENTS_ERROR" });
    }
  },

  // ✅ Add a new program requirement
  add: async (req, res) => {
    const { programId, courseCode, prerequisiteCourseCode } = req.body;

    if (!programId || !courseCode) {
      return res.status(400).json({ message: "Program ID and Course Code are required", code: "MISSING_FIELDS" });
    }

    try {
      await ProgramRequirementModel.add(programId, courseCode, prerequisiteCourseCode);
      res.status(201).json({ message: "Program requirement added successfully" });
    } catch (error) {
      console.error("Error adding program requirement:", error);
      res.status(500).json({ message: "Failed to add program requirement", code: "ADD_PROGRAM_REQUIREMENT_ERROR" });
    }
  },

  // ✅ Delete a program requirement
  delete: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Program requirement ID is required", code: "MISSING_FIELDS" });
    }

    try {
      const affectedRows = await ProgramRequirementModel.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Program requirement not found", code: "PROGRAM_REQUIREMENT_NOT_FOUND" });
      }

      res.status(200).json({ message: "Program requirement deleted successfully" });
    } catch (error) {
      console.error("Error deleting program requirement:", error);
      res.status(500).json({ message: "Failed to delete program requirement", code: "DELETE_PROGRAM_REQUIREMENT_ERROR" });
    }
  },
};

module.exports = ProgramRequirementController;
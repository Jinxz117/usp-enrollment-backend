const financeModel = require("../Model/financeModel");

// const financeController = {
//   // Get finance details for a student
//   getFinance: async (req, res) => {
//     try {
//       const { studentId } = req.params;
//       const finance = await financeModel.getByStudentId(studentId);

//      // if (finance) res.json(finance);  main change
//       if (financeRecords.length > 0) {
//       res.json(financeRecords); // Return all finance records
//       }
//       else res.status(404).json({ message: "Finance record not found." });

//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

const financeController = {
  // Get finance details for a student
  getFinance: async (req, res) => {
    try {
      const { studentId } = req.params;
      
      // Fetch finance records from database
      const financeRecords = await financeModel.getByStudentId(studentId);

      // Ensure the variable exists before returning it
      if (!financeRecords || financeRecords.length === 0) {
        return res.status(404).json({ message: "No finance records found." });
      }

      res.json(financeRecords); // Return all finance records as an array
    } catch (error) {
      console.error("Error fetching finance records:", error);
      res.status(500).json({ error: error.message });
    }
  },




  // Create a new finance record
  createFinance: async (req, res) => {
    try {
      const data = req.body;
      const result = await financeModel.create(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update payment for a student
  updatePayment: async (req, res) => {
    try {
      const { studentId } = req.params;
      const { paid_amount } = req.body;

      const result = await financeModel.updatePayment(studentId, paid_amount);
      if (result) res.json(result);
      else res.status(404).json({ message: "Finance record not found." });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete finance record
  deleteFinance: async (req, res) => {
    try {
      const { studentId } = req.params;
      const result = await financeModel.delete(studentId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = financeController;
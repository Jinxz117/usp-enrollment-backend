// const financeModel = require("../Model/financeModel");

// const financeController = {
//   // Get finance details for a student
//   getFinance: async (req, res) => {
//     try {
//       const { studentId } = req.params;
//       // 
//       // Fetch finance records from database
//       const financeRecords = await financeModel.getByStudentId(studentId);

//       // Ensure the variable exists before returning it
//       if (!financeRecords || financeRecords.length === 0) {
//         return res.status(404).json({ message: "No finance records found.",code: "404" });
//       }

//       res.json(financeRecords); // Return all finance records as an array
//     } catch (error) {
//       console.error("Error fetching finance records:", error);
//       res.status(500).json({ error: error.message, code: "500"});
//     }
//   },




//   // Create a new finance record
//   createFinance: async (req, res) => {
//     try {
//       const data = req.body;
//       const result = await financeModel.create(data);
//       res.status(201).json(result);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   // Update payment for a student
//   updatePayment: async (req, res) => {
//     try {
//       const { studentId } = req.params;
//       const { paid_amount } = req.body;

//       const result = await financeModel.updatePayment(studentId, paid_amount);
//       if (result) res.json(result);
//       else res.status(404).json({ message: "Finance record not found.", code: "404" });

//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   // Delete finance record
//   deleteFinance: async (req, res) => {
//     try {
//       const { studentId } = req.params;
//       const result = await financeModel.delete(studentId);
//       res.json(result);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// };

// module.exports = financeController;

const financeModel = require("../Model/financeModel");

const financeController = {
  // ✅ Get finance details for a student
  getFinance: async (req, res) => {
    try {
      const { studentId } = req.params;

      // Fetch finance records from the database
      const financeRecords = await financeModel.getByStudentId(studentId);

      // Ensure the variable exists before returning it
      if (!financeRecords || financeRecords.length === 0) {
        return res.status(404).json({ message: "No finance records found.", code: "FINANCE_NOT_FOUND" });
      }

      res.json(financeRecords); // Return all finance records as an array
    } catch (error) {
      console.error("Error fetching finance records:", error);
      res.status(500).json({ message: "Error fetching finance records", code: "GET_FINANCE_ERROR" });
    }
  },

  // ✅ Create a new finance record
  createFinance: async (req, res) => {
    try {
      const data = req.body;

      // Validate required fields
      if (!data.studentId || !data.amount_due) {
        return res.status(400).json({ message: "Missing required fields", code: "MISSING_FIELDS" });
      }

      const result = await financeModel.create(data);
      res.status(201).json({ message: "Finance record created successfully", result });
    } catch (error) {
      console.error("Error creating finance record:", error);
      res.status(500).json({ message: "Error creating finance record", code: "CREATE_FINANCE_ERROR" });
    }
  },

  // ✅ Update payment for a student
  updatePayment: async (req, res) => {
    try {
      const { studentId } = req.params;
      const { paid_amount } = req.body;

      // Validate required fields
      if (!paid_amount) {
        return res.status(400).json({ message: "Paid amount is required", code: "MISSING_FIELDS" });
      }

      const result = await financeModel.updatePayment(studentId, paid_amount);

      if (result) {
        res.json({ message: "Payment updated successfully", result });
      } else {
        res.status(404).json({ message: "Finance record not found", code: "FINANCE_NOT_FOUND" });
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ message: "Error updating payment", code: "UPDATE_PAYMENT_ERROR" });
    }
  },

  // ✅ Delete finance record
  deleteFinance: async (req, res) => {
    try {
      const { studentId } = req.params;

      const result = await financeModel.delete(studentId);

      if (result) {
        res.json({ message: "Finance record deleted successfully", result });
      } else {
        res.status(404).json({ message: "Finance record not found", code: "FINANCE_NOT_FOUND" });
      }
    } catch (error) {
      console.error("Error deleting finance record:", error);
      res.status(500).json({ message: "Error deleting finance record", code: "DELETE_FINANCE_ERROR" });
    }
  },
};

module.exports = financeController;
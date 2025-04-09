    // const db = require("./db");

    

    // const financeModel = {
    //     // Get all finance records by student ID
    //     getByStudentId: async (studentId) => {
    //         const query = "SELECT * FROM finances WHERE student_id = ?";
    //         const [rows] = await db.execute(query, [studentId]);
    //         return rows;  // Return all records as an array (even if empty)
    //     },
    
    
 
    

    // // Create a new finance record
    // create: async ({ student_id, invoice_number, total_fee, paid_amount, year, semester }) => {
    //     const balance = total_fee - paid_amount;
    //     const status = balance === 0 ? "paid" : "due";

    //     const query = `
    //     INSERT INTO finances (student_id, invoice_number, total_fee, paid_amount, balance, status, year, semester) 
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
    //     await db.execute(query, [student_id, invoice_number, total_fee, paid_amount, balance, status, year, semester]);
    //     return { message: "Finance record added successfully." };
    // },

    // // Update payment amount for a student
    // updatePayment: async (studentId, paidAmount) => {
    //     const query = "SELECT * FROM finances WHERE student_id = ?";
    //     const [rows] = await db.execute(query, [studentId]);
        
    //     if (!rows.length) return null;

    //     const currentPaid = parseFloat(rows[0].paid_amount) + parseFloat(paidAmount);
    //     const balance = parseFloat(rows[0].total_fee) - currentPaid;
    //     const status = balance === 0 ? "paid" : "due";

    //     const updateQuery = "UPDATE finances SET paid_amount = ?, balance = ?, status = ? WHERE student_id = ?";
    //     await db.execute(updateQuery, [currentPaid, balance, status, studentId]);

    //     return { message: "Payment updated successfully.", new_balance: balance };
    // },

    // // Delete finance record
    // delete: async (studentId) => {
    //     const query = "DELETE FROM finances WHERE student_id = ?";
    //     await db.execute(query, [studentId]);
    //     return { message: "Finance record deleted successfully." };
    // }
    // };

    // module.exports = financeModel;

const db = require("./db");

const financeModel = {
  // ✅ Get all finance records by student ID
  getByStudentId: async (studentId) => {
    try {
      const query = "SELECT * FROM finances WHERE student_id = ?";
      const [rows] = await db.query(query, [studentId]); // Use db.query
      return rows; // Return all records as an array (even if empty)
    } catch (error) {
      console.error("Error fetching finance records by student ID:", error);
      throw { code: "GET_FINANCE_BY_STUDENT_ID_ERROR", message: "Failed to fetch finance records", details: error.message };
    }
  },

  // ✅ Create a new finance record
  create: async ({ student_id, invoice_number, total_fee, paid_amount, year, semester }) => {
    try {
      const balance = total_fee - paid_amount;
      const status = balance === 0 ? "paid" : "due";

      const query = `
        INSERT INTO finances (student_id, invoice_number, total_fee, paid_amount, balance, status, year, semester) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(query, [student_id, invoice_number, total_fee, paid_amount, balance, status, year, semester]);
      return { message: "Finance record added successfully.", insertId: result.insertId };
    } catch (error) {
      console.error("Error creating finance record:", error);
      throw { code: "CREATE_FINANCE_ERROR", message: "Failed to create finance record", details: error.message };
    }
  },

  // ✅ Update payment amount for a student
  updatePayment: async (studentId, paidAmount) => {
    try {
      const query = "SELECT * FROM finances WHERE student_id = ?";
      const [rows] = await db.query(query, [studentId]);

      if (!rows.length) return null;

      const currentPaid = parseFloat(rows[0].paid_amount) + parseFloat(paidAmount);
      const balance = parseFloat(rows[0].total_fee) - currentPaid;
      const status = balance === 0 ? "paid" : "due";

      const updateQuery = "UPDATE finances SET paid_amount = ?, balance = ?, status = ? WHERE student_id = ?";
      await db.query(updateQuery, [currentPaid, balance, status, studentId]);

      return { message: "Payment updated successfully.", new_balance: balance };
    } catch (error) {
      console.error("Error updating payment:", error);
      throw { code: "UPDATE_PAYMENT_ERROR", message: "Failed to update payment", details: error.message };
    }
  },

  // ✅ Delete finance record
  delete: async (studentId) => {
    try {
      const query = "DELETE FROM finances WHERE student_id = ?";
      const [result] = await db.query(query, [studentId]);

      if (result.affectedRows === 0) {
        return null; // No record found to delete
      }

      return { message: "Finance record deleted successfully." };
    } catch (error) {
      console.error("Error deleting finance record:", error);
      throw { code: "DELETE_FINANCE_ERROR", message: "Failed to delete finance record", details: error.message };
    }
  },
};

module.exports = financeModel;
    const db = require("./db");

    // const financeModel = {
    // // Get finance record by student ID
    // getByStudentId: async (studentId) => {
    //     const query = "SELECT * FROM finances WHERE student_id = ?";
    //     const [rows] = await db.execute(query, [studentId]);
    //     return rows.length ? rows[0] : null;
    // },

    const financeModel = {
        // Get all finance records by student ID
        getByStudentId: async (studentId) => {
            const query = "SELECT * FROM finances WHERE student_id = ?";
            const [rows] = await db.execute(query, [studentId]);
            return rows;  // Return all records as an array (even if empty)
        },
    
    
 
    

    // Create a new finance record
    create: async ({ student_id, invoice_number, total_fee, paid_amount, year, semester }) => {
        const balance = total_fee - paid_amount;
        const status = balance === 0 ? "paid" : "due";

        const query = `
        INSERT INTO finances (student_id, invoice_number, total_fee, paid_amount, balance, status, year, semester) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await db.execute(query, [student_id, invoice_number, total_fee, paid_amount, balance, status, year, semester]);
        return { message: "Finance record added successfully." };
    },

    // Update payment amount for a student
    updatePayment: async (studentId, paidAmount) => {
        const query = "SELECT * FROM finances WHERE student_id = ?";
        const [rows] = await db.execute(query, [studentId]);
        
        if (!rows.length) return null;

        const currentPaid = parseFloat(rows[0].paid_amount) + parseFloat(paidAmount);
        const balance = parseFloat(rows[0].total_fee) - currentPaid;
        const status = balance === 0 ? "paid" : "due";

        const updateQuery = "UPDATE finances SET paid_amount = ?, balance = ?, status = ? WHERE student_id = ?";
        await db.execute(updateQuery, [currentPaid, balance, status, studentId]);

        return { message: "Payment updated successfully.", new_balance: balance };
    },

    // Delete finance record
    delete: async (studentId) => {
        const query = "DELETE FROM finances WHERE student_id = ?";
        await db.execute(query, [studentId]);
        return { message: "Finance record deleted successfully." };
    }
    };

    module.exports = financeModel;
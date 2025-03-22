const express = require("express");
const router = express.Router();
const financeController = require("../Controllers/financeController");

router.get("/:studentId", financeController.getFinance);    
  // Get finance record
router.post("/", financeController.createFinance);           // Create finance record
router.put("/:studentId", financeController.updatePayment);  // Update payment
router.delete("/:studentId", financeController.deleteFinance); // Delete finance record

module.exports = router;
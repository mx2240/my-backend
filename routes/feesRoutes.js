const express = require("express");
const router = express.Router();
const {
    createFee,
    getFees,
    assignFee,
    getAssignedStudents,
    updatePaymentStatus,
    deleteFee
} = require("../controllers/feesController");

// Create fee
router.post("/", createFee);

// Get all fees
router.get("/", getFees);

// Assign fee to students
router.post("/:feeId/assign", assignFee);

// Get all students assigned to a fee
router.get("/:feeId/assigned", getAssignedStudents);

// Update payment status
router.put("/:feeId/status/:studentId", updatePaymentStatus);

// Delete fee
router.delete("/:id", deleteFee);

module.exports = router;

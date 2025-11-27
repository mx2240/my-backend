// routes/feesRoutes.js
const express = require("express");
const router = express.Router();

const {
    createFee,
    getFees,
    assignFee,
    getAssignedStudents,
    updatePaymentStatus,
    deleteFee
} = require("../controllers/feeController");

// Create new fee
router.post("/", createFee);

// Get all fees
router.get("/", getFees);

// Assign fee to students
router.post("/:feeId/assign", assignFee);

// Get all students assigned to a fee
router.get("/:feeId/assigned", getAssignedStudents);

// Update student fee payment status
router.put("/:feeId/status/:studentId", updatePaymentStatus);

// Delete a fee
router.delete("/:id", deleteFee);

module.exports = router;

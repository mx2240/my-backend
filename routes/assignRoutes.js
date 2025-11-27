const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
    assignFeeToStudent,
    getAssignedStudents,
    updateFeeStatus,
    deleteAssignedFee,
} = require("../controllers/assignController");


// Assign fee to student
router.post("/assign", protect, admin, assignFeeToStudent);

// Get all students assigned to a fee
router.get("/:feeId/students", protect, admin, getAssignedStudents);

// Update status
router.put("/:assignId/status", protect, admin, updateFeeStatus);

// Delete assigned fee
router.delete("/:assignId", protect, admin, deleteAssignedFee);

module.exports = router;


const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const {
    assignFeeToStudent,
    getAssignedStudents,
    updateFeeStatus,
    deleteAssignedFee,
    getAssignedFees,
} = require("../controllers/assignController");

// Assign fee to student
router.post("/assign", verifyToken, verifyAdmin, assignFeeToStudent);

// Get all students assigned to a fee
router.get("/:feeId/students", verifyToken, verifyAdmin, getAssignedStudents);

// Update payment status
router.put("/:assignId/status", verifyToken, verifyAdmin, updateFeeStatus);

// Delete assigned fee
router.delete("/:assignId", verifyToken, verifyAdmin, deleteAssignedFee);

// Get ALL fees assigned to one specific student
router.get("/student/:studentId", verifyToken, verifyAdmin, getAssignedFees);

module.exports = router;





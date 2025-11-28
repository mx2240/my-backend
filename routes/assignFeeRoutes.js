const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const {
    assignFeeToStudent,
    getAssignedStudents,
    updateFeeStatus,
    deleteAssignedFee,
} = require("../controllers/assignController");

router.post("/assign", verifyToken, verifyAdmin, assignFeeToStudent);
router.get("/:feeId/students", verifyToken, verifyAdmin, getAssignedStudents);
router.put("/:assignId/status", verifyToken, verifyAdmin, updateFeeStatus);
router.delete("/:assignId", verifyToken, verifyAdmin, deleteAssignedFee);

module.exports = router;

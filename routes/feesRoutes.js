const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const {
    createFee,
    assignFee,
    getStudentsWithFees,
    updateFeeStatus
} = require("../controllers/feesController");

// --- Admin only ---
router.post("/create", verifyToken, verifyAdmin, createFee);
router.post("/assign", verifyToken, verifyAdmin, assignFee);
router.get("/students", verifyToken, verifyAdmin, getStudentsWithFees);
router.put("/status", verifyToken, verifyAdmin, updateFeeStatus);

module.exports = router;

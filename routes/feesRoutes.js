const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const {
    createFee,
    assignFee,
    getStudentsWithFees,
    updateFeeStatus,
    getAllFees,
    deleteFee

} = require("../controllers/feesController");

// --- Admin only ---
router.post("/create", verifyToken, verifyAdmin, createFee);
router.post("/assign", verifyToken, verifyAdmin, assignFee);
router.get("/students", verifyToken, verifyAdmin, getStudentsWithFees);
router.put("/status", verifyToken, verifyAdmin, updateFeeStatus);
router.get("/all", verifyToken, verifyAdmin, getAllFees);
router.get("/", verifyToken, verifyAdmin, getAllFees);
router.delete("/:id", verifyToken, verifyAdmin, deleteFee);




module.exports = router;

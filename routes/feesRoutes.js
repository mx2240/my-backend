const express = require("express");
const router = express.Router();

const {
    createFee,
    getFees,
    getFeeById,
    updateFee,
    deleteFee,
    getMyFees,
} = require("../controllers/feesController");

// import actual middleware
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// map them to old names so your code still works
const protect = verifyToken;
const admin = verifyAdmin;

// Admin routes
router.post("/", protect, admin, createFee);
router.get("/", protect, admin, getFees);
router.get("/:id", protect, admin, getFeeById);
router.put("/:id", protect, admin, updateFee);
router.delete("/:id", protect, admin, deleteFee);

// Student route
router.get("/my/fees", protect, getMyFees);

module.exports = router;

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

const { verifyToken, verifyAdmin, verifyStudent } = require("../middleware/authMiddleware");

router.get("/my/fees", verifyToken, verifyStudent, getMyFees);

router.post("/", verifyToken, verifyAdmin, createFee);
router.get("/", verifyToken, verifyAdmin, getFees);
router.get("/:id", verifyToken, verifyAdmin, getFeeById);
router.put("/:id", verifyToken, verifyAdmin, updateFee);
router.delete("/:id", verifyToken, verifyAdmin, deleteFee);

module.exports = router;


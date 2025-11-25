// routes/feesRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const feesController = require("../controllers/feesController");

router.post("/", verifyToken, verifyAdmin, feesController.createFee);
router.get("/", verifyToken, verifyAdmin, feesController.getFees);
router.post("/assign", verifyToken, verifyAdmin, feesController.assignFee);
router.get("/assigned", verifyToken, verifyAdmin, feesController.getAssigned);
router.post("/pay/:id", verifyToken, verifyAdmin, feesController.markPaid);
router.delete("/:id", verifyToken, verifyAdmin, feesController.deleteFee);

module.exports = router;

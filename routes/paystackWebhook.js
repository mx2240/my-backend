const express = require("express");
const crypto = require("crypto");
const AssignedStudent = require("../models/AssignedStudent");

const router = express.Router();

// PAYSTACK WEBHOOK
router.post("/webhook", async (req, res) => {
    const secret = process.env.PAYSTACK_SECRET;

    const hash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
        return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;

    if (event === "charge.success") {
        const { assignedFeeId } = req.body.data.metadata;

        await AssignedStudent.findByIdAndUpdate(assignedFeeId, {
            status: "paid",
            paidAt: new Date()
        });

        console.log("Fee updated to PAID");
    }

    return res.sendStatus(200);
});

module.exports = router;

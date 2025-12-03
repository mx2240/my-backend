const express = require("express");
const router = express.Router();
const axios = require("axios");
const AssignedStudent = require("../models/AssignedStudent");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const VERIFY_URL = "https://api.paystack.co/transaction/verify";

router.get("/callback", async (req, res) => {
    try {
        const reference = req.query.reference;

        if (!reference) {
            return res.status(400).json({ ok: false, message: "No reference found" });
        }

        // Verify transaction
        const resp = await axios.get(`${VERIFY_URL}/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`
            }
        });

        const data = resp.data.data;

        if (data.status !== "success") {
            return res.redirect(process.env.FRONTEND_URL + "/payment-failed");
        }

        // Retrieve metadata
        const assignedFeeId = data.metadata.assignedFeeId;

        // Update assigned fee as paid
        await AssignedStudent.findByIdAndUpdate(assignedFeeId, {
            status: "paid",
            paymentReference: reference
        });

        // Redirect to frontend success route
        return res.redirect(
            `${process.env.FRONTEND_URL}/payment-success?reference=${reference}`
        );

    } catch (err) {
        console.error("CALLBACK ERROR:", err.response?.data || err.message);
        return res.redirect(process.env.FRONTEND_URL + "/payment-failed");
    }
});

module.exports = router;

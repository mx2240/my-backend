const express = require("express");
const router = express.Router();
const axios = require("axios");
const studentAuth = require("../middleware/studentAuth");
const AssignedStudent = require("../models/AssignedStudent");

require("dotenv").config();

// INITIATE PAYMENT
router.post("/initiate", studentAuth, async (req, res) => {
    try {
        const { assignedFeeId } = req.body;
        const studentId = req.student.id;

        const myFee = await AssignedStudent.findOne({
            _id: assignedFeeId,
            student: studentId
        }).populate("fee");

        if (!myFee) {
            return res.status(404).json({ ok: false, message: "Fee not found" });
        }

        const payload = {
            email: req.student.email,       // FIXED
            amount: myFee.fee.amount * 100, // Convert to kobo
            callback_url: process.env.PAYSTACK_CALLBACK_URL,
            metadata: {
                assignedFeeId,
                studentId
            }
        };

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
                }
            }
        );

        return res.json({
            ok: true,
            authorization_url: response.data.data.authorization_url
        });

    } catch (err) {
        console.error("PAYSTACK INIT ERROR:", err.response?.data || err.message);
        return res.status(500).json({ ok: false, message: "Paystack error" });
    }
});



router.get("/verify", async (req, res) => {
    try {
        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({ ok: false, message: "Reference required" });
        }

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
                }
            }
        );

        const data = response.data.data;

        if (data.status !== "success") {
            return res.status(400).json({ ok: false, message: "Payment failed" });
        }

        await AssignedStudent.findByIdAndUpdate(
            data.metadata.assignedFeeId,
            { status: "paid" }
        );

        return res.json({ ok: true, message: "Payment verified" });

    } catch (err) {
        console.error("VERIFY ERROR:", err.response?.data || err.message);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});


module.exports = router;

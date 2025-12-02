const express = require("express");
const router = express.Router();
const axios = require("axios");
const studentAuth = require("../middleware/studentAuth");
const Fee = require("../models/Fee");
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
            return res.json({ ok: false, message: "Fee not found" });
        }

        const paystackData = {
            email: req.student.email,
            amount: myFee.fee.amount * 100, // kobo
            callback_url: process.env.PAYSTACK_CALLBACK_URL,
            metadata: {
                assignedFeeId,
                studentId
            }
        };

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            paystackData,
            { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` } }
        );

        return res.json({
            ok: true,
            authorization_url: response.data.data.authorization_url
        });

    } catch (err) {
        console.error("PAYSTACK INIT ERROR:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
});

module.exports = router;

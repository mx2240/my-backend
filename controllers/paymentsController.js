const axios = require("axios");
const AssignFee = require("../models/AssignedStudent");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize";
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

exports.initPaystack = async (req, res) => {
    try {
        const { assignedFeeId } = req.body;
        const studentId = req.student.id;
        const studentEmail = req.student.email;

        if (!assignedFeeId)
            return res.status(400).json({ ok: false, message: "assignedFeeId required" });

        const assignedFee = await AssignFee.findById(assignedFeeId).populate("fee");

        if (!assignedFee)
            return res.status(404).json({ ok: false, message: "Assigned fee not found" });

        const amountKobo = assignedFee.fee.amount * 100;

        const payload = {
            email: studentEmail,
            amount: amountKobo,
            callback_url: process.env.PAYSTACK_CALLBACK_URL,
            metadata: {
                assignedFeeId,
                studentId
            }
        };

        const resp = await axios.post(PAYSTACK_INIT_URL, payload, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
        });

        return res.json({
            ok: true,
            authorization_url: resp.data.data.authorization_url
        });

    } catch (err) {
        console.error("initPaystack error:", err.response?.data || err.message);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};


exports.verifyPaystack = async (req, res) => {
    try {
        const { reference } = req.query;

        if (!reference)
            return res.status(400).json({ ok: false, message: "reference required" });

        const resp = await axios.get(`${PAYSTACK_VERIFY_URL}/${reference}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
        });

        const data = resp.data.data;

        if (data.status !== "success") {
            return res.status(400).json({ ok: false, message: "Payment failed" });
        }

        // Update fee status
        await AssignFee.findByIdAndUpdate(
            data.metadata.assignedFeeId,
            { status: "paid" }
        );

        // Redirect back to frontend dashboard
        return res.redirect(`${process.env.FRONTEND_URL}/student/dashboard?payment=success`);

    } catch (err) {
        console.error("verifyPaystack error:", err.response?.data || err.message);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};

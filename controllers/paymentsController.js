// controllers/paymentsController.js
const axios = require("axios");
const AssignFee = require("../models/AssignedStudent");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize";
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

exports.initPaystack = async (req, res) => {
    try {
        const { assignmentId, email } = req.body;
        if (!assignmentId || !email) return res.status(400).json({ ok: false, message: "assignmentId and email required" });

        const assignment = await AssignFee.findById(assignmentId).populate("fee");
        if (!assignment) return res.status(404).json({ ok: false, message: "Assignment not found" });

        const amountKobo = Math.round(assignment.fee.amount * 100);

        const payload = {
            email,
            amount: amountKobo,
            metadata: { assignmentId }
        };

        const resp = await axios.post(PAYSTACK_INIT_URL, payload, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
        });

        if (!resp.data || !resp.data.data) return res.status(500).json({ ok: false, message: "Paystack init failed" });

        res.json({ ok: true, authorization_url: resp.data.data.authorization_url, access_code: resp.data.data.access_code });
    } catch (err) {
        console.error("initPaystack error:", err.response?.data || err.message);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.verifyPaystack = async (req, res) => {
    try {
        const { reference } = req.query;
        if (!reference) return res.status(400).json({ ok: false, message: "reference required" });

        const resp = await axios.get(`${PAYSTACK_VERIFY_URL}/${reference}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
        });

        // resp.data.data.metadata.assignmentId expected
        const { status, data } = resp.data;
        if (!status || data.status !== "success") return res.status(400).json({ ok: false, message: "Payment failed" });

        const assignmentId = data.metadata?.assignmentId;
        if (assignmentId) {
            await AssignFee.findByIdAndUpdate(assignmentId, { status: "paid" });
        }

        res.json({ ok: true, message: "Payment verified", data });
    } catch (err) {
        console.error("verifyPaystack error:", err.response?.data || err.message);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

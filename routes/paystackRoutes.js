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




// const express = require("express");
// const router = express.Router();
// const AssignedFee = require("../models/AssignedStudent");
// const axios = require("axios");
// const auth = require("../middleware/authMiddleware");

// router.post("/initiate", auth, async (req, res) => {
//     try {
//         const { assignedFeeId } = req.body;

//         const assigned = await AssignedFee.findById(assignedFeeId).populate("fee");

//         if (!assigned)
//             return res.json({ ok: false, message: "Invalid assigned fee" });

//         const paystackRes = await axios.post(
//             "https://api.paystack.co/transaction/initialize",
//             {
//                 email: req.user.email,
//                 amount: assigned.fee.amount * 100,
//                 metadata: { assignedFeeId }
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
//                 }
//             }
//         );

//         res.json({
//             ok: true,
//             authorization_url: paystackRes.data.data.authorization_url
//         });

//     } catch (err) {
//         res.json({ ok: false, message: "Payment init failed" });
//     }
// });

// module.exports = router;


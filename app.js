// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// ===========================
// Middleware
// ===========================
const allowedOrigins = [
    "http://localhost:5173", // local Vite dev
    "https://my-frontend-brown-eta.vercel.app",
    "https://vite-react-delta-six-49.vercel.app"
    // production frontend
];

// CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow non-browser requests (Postman, server-side)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight OPTIONS requests
app.options("*", cors());

// JSON parsing
app.use(express.json());

// ===========================
// Import routes
// ===========================
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const courseRoutes = require("./routes/coursesRoutes");
const studentRoutes = require("./routes/studentsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const feesRoutes = require("./routes/feesRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const transportRoutes = require("./routes/transportRoutes");
const driverRoutes = require("./routes/driverRoutes");
const busAttendanceRoutes = require("./routes/busAttendanceRoutes");
const parentRoutes = require("./routes/parentRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const adminProfileRoutes = require("./routes/adminProfileRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const assignFeeRouter = require("./routes/assignFeeRoutes");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const studentFeesRoutes = require("./routes/studentFeesRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

// ===========================
// API Routes
// ===========================
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance/bus", busAttendanceRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", require("./routes/adminSettingsRoutes"));
app.use("/api/assign-fee", assignFeeRouter);
app.use("/api/student", studentAuthRoutes);
app.use("/api/student", studentFeesRoutes);
app.use("/api/student/profile", require("./routes/studentProfileRoutes"));
app.use("/api/payments", require("./routes/paymentsRoutes"));
app.use("/api/paystack", require("./routes/paystackRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/auth", passwordRoutes);
app.use("/api/student/auth", require("./routes/studentAuthRoutes"));









// ===========================
// Root Route
// ===========================
app.get("/", (req, res) => {
    res.json({ message: "✅ School API running successfully" });
});

// ===========================
// Global Error Handler
// ===========================
app.use((err, req, res, next) => {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
});

// ===========================
// Local development server
// ===========================
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}

// ===========================
// Export for Vercel serverless
// ===========================
module.exports = app;











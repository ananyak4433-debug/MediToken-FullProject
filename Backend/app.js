process.env.TZ = 'Asia/Kolkata';

require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const connectDB = require("./src/config/db");
connectDB();

const startAppointmentCron = require('./src/cron/appointmentCron');
startAppointmentCron();

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:3001"],
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3001",
  "https://your-website.vercel.app",
  "https://your-admin.vercel.app",
  "https://your-vendor.vercel.app"
];

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",

      // frontend deployed URLs
      "https://meditoken-website-1dr6lzwai-ananyak4433-debugs-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const uploadRoutes = require("./src/routes/uploadRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const staffRoutes = require("./src/routes/staffRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const vendorRoutes = require("./src/routes/vendorRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const supportTypeRoutes = require("./src/routes/supportTypeRoutes");
const supportRequestRoutes = require("./src/routes/supportRequestRoutes");

app.use("/api", uploadRoutes);
app.use("/api", adminRoutes);
app.use("/api", doctorRoutes);
app.use("/api", staffRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", vendorRoutes);
app.use("/api", patientRoutes);
app.use("/api", departmentRoutes);
app.use("/api", supportTypeRoutes);
app.use("/api", supportRequestRoutes); 

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
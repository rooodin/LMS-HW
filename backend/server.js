//imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // Routes for the dashboards
const materialRoutes = require("./routes/materialRoutes"); // Import material routes
// const paymentRoutes = require("./routes/paymentRoutes"); // -- stripe
//consts
const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
  })
);

// app.use("/api/payments", paymentRoutes); // stripe

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api", quizRoutes);
app.use("/api", submissionRoutes);
app.use("/api/material", materialRoutes); // Register the routes with "/materials"

// app.use("/dashboard", dashboardRoutes); // All dashboard-related routes will be prefixed with /dashboard
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))

  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`server work in address: http://localhost:${PORT}`);
});

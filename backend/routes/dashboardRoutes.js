const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const authenticateToken = require("../middleware/authMiddleware"); // Import the authentication middleware
const checkRole = require("../middleware/checkRole"); // Import the role-checking middleware

// Admin Dashboard - View all courses and student statistics
router.get(
  "/admin",
  authenticateToken,
  checkRole("admin"),
  async (req, res) => {
    try {
      const courses = await Course.find().populate("instructor", "username");
      const enrollments = await Enrollment.find()
        .populate("user", "username")
        .populate("course", "title");

      // Get statistics
      const studentStats = {};
      enrollments.forEach((enrollment) => {
        const courseTitle = enrollment.course.title;
        const student = enrollment.user.username;
        if (!studentStats[courseTitle]) {
          studentStats[courseTitle] = [];
        }
        studentStats[courseTitle].push({
          student,
          progress: enrollment.progress,
        });
      });

      res.status(200).json({
        courses,
        studentStats,
      });
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Instructor Dashboard - View list of students in their courses
router.get(
  "/instructor",
  authenticateToken,
  checkRole("instructor"),
  async (req, res) => {
    try {
      // Use req.user.id instead of req.user._id
      const courses = await Course.find({ instructor: req.user.id }).populate(
        "materials"
      );

      const enrollments = await Enrollment.find({
        course: { $in: courses.map((course) => course._id) },
      })
        .populate("user", "username")
        .populate("course", "title");

      console.log("Fetched Courses:", courses);
      console.log("Fetched Enrollments:", enrollments);

      res.status(200).json({
        courses,
        enrollments,
      });
    } catch (error) {
      console.error("Error fetching instructor dashboard data:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Student Dashboard - View enrolled courses and progress
router.get(
  "/student",
  authenticateToken,
  checkRole("student"),
  async (req, res) => {
    try {
      // Get all enrollments for the student
      const enrollments = await Enrollment.find({ user: req.user.id })
        .populate("course", "title description")
        .populate("materials");

      res.status(200).json({
        enrollments,
      });
    } catch (error) {
      console.error("Error fetching student dashboard data:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

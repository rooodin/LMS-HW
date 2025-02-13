const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment"); // Import the Enrollment model
const User = require("../models/User"); // Import the User model
const Course = require("../models/Course"); // Import the Course model

// Create a new enrollment
router.post("/", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if the user and course exist
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(400).json({ message: "User or Course not found" });
    }

    // Create a new enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      progress: 0, // Default progress is 0 when starting the course
      status: "enrolled", // Default status is 'not-started'
    });

    // Save the enrollment
    await enrollment.save();

    res.status(201).json({
      message: "Enrollment created successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all enrollments for a specific user (Populate user and course data)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch enrollments for the user and populate the user and course data
    const enrollments = await Enrollment.find({ user: userId })
      .populate("user", "username email")
      .populate("course", "courseName");

    if (enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrollments found for this user" });
    }

    res.status(200).json({ enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update enrollment progress (e.g., when a student makes progress in the course)
router.put("/:enrollmentId", async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress, status, materials } = req.body; // Include 'materials' in the request body

    // Find the enrollment by ID
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Update progress and status
    enrollment.progress =
      progress !== undefined ? progress : enrollment.progress;
    enrollment.status = status || enrollment.status;

    // Update materials if provided in the request body
    if (materials && Array.isArray(materials)) {
      enrollment.materials = materials; // This will replace the current materials with the new ones
    }

    // Save the updated enrollment
    await enrollment.save();

    res
      .status(200)
      .json({ message: "Enrollment updated successfully", enrollment });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all enrollments (Admin route to view all enrollments)
router.get("/", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "username email") // Populate the user's username and email
      .populate("course", "courseName"); // Populate the course's courseName

    res.status(200).json({ enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an enrollment (Admin or user can delete enrollment)
router.delete("/:enrollmentId", async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

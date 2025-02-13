const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the instructor
      required: true,
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material", // References study materials (videos, PDFs, text)
      },
    ],
    enrollmentCount: {
      type: Number,
      default: 0, // Track number of enrolled students
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft", // Defines if the course is available
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

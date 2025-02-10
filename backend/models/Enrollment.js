const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // Reference to the course
    progress: { type: Number, default: 0 }, // Percentage of course completed
    status: {
      type: String,
      enum: ["enrolled", "in-progress", "completed"],
      default: "enrolled",
    }, // Enrollment status
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material", // References study materials (video, PDF, text)
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;

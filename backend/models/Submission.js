
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({

    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    type: {
        type: String,
        enum: ["quiz", "homework"],
        required: true,
    },
    submissionRef: { type: mongoose.Schema.Types.ObjectId, refPath: "typeRef", required: true },
    typeRef: { 
        type: String, 
        enum: ["QuizSubmission", "HomeworkSubmission"], 
        required: true 
      },
    status: {
        type: String,
        enum: ["pending", "graded", "revised"],
        default: "pending"
    },



},
    {
        timestamps: true,
    }
);

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
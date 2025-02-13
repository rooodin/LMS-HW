const mongoose = require("mongoose");

const homeworkSubmissionSchema = new mongoose.Schema({

    homework_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    homeworkData: {
        fileUrl: String,
        feedback: String,
    },
}, { timestamps: true });

const HomeworkSubmission = mongoose.model("HomeworkSubmission", homeworkSubmissionSchema);


module.exports = homeworkSubmissionSchema;

const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema({

    quiz_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Quiz", 
        required: true 
    },
    student_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    answers: [
        {
            question_id: { 
                type: mongoose.Schema.Types.ObjectId, 
                required: true 
            },
            selected_answer: { 
                type: Number, 
                required: true 
            }
        }
    ],
    score: { 
        type: Number 
    }
}, { timestamps: true });

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);


module.exports = QuizSubmission;

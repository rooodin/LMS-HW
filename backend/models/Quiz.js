
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    questions: [
        {
            question_title: {
                type: String,
                required: true,
            },
            answer_options: [
                {
                    type: String,
                    required: true,
                }
            ],
            correct_answer:{
                type:Number,
                required:true,
            }
        }
    ]


},
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
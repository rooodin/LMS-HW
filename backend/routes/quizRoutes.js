const express = require('express');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Submission = require('../models/Submission');
const authenticateToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const router = express.Router();


//Create new quiz (POST request)
router.post("/quizzes",authenticateToken,checkRole("instructor"), async (req, res) => {
    try {
        const { title, course_id, questions } = req.body;

        //check course exist and check this is instructor
        // course = await Course.

        const quiz = new Quiz(
            {
                title,
                course_id,
                questions,
            }
        );
        await quiz.save();

        res.status(201).json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//send all the quizzes that belong to the course 
router.get("/quizzes/:course_id", async (req, res) => {
    try {
        const course_id = req.params.course_id;
        // validate course is exist
        const course = await Course.findById(course_id);
        if(!course){
            return res.status(400).json({message:"Course Not Found"});
        }

        const quizzes = await Quiz.find({ course_id, });
        res.status(200).json(quizzes);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

//send specific quiz by quiz_id (questions)
router.get("/quiz/:quiz_id", async (req, res) => {
    try {
        const quiz_id = req.params.quiz_id;
        const quiz = await Quiz.findById(quiz_id);

        if (!quiz) {
            return res.status(400).json({ message: "Quiz Not found!" });
        }

        res.status(200).json(quiz);


    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


//SUBMIT A QUIZ BY STUDENT (POST)
router.post("/quizzes/:id/submit", async (req, res) => {
    try {
        const quiz_id = req.params.id;
        const { student_id, answers,course_id } = req.body;

        //get answers 
        const answers_questions = Object.keys(answers).map(key => {
            const [prefix, question_id] = key.split("-");
            const selected_answer = answers[key];
            return {
                question_id,
                selected_answer: parseInt(selected_answer),
            }
        })

        const quiz = await Quiz.findById(quiz_id);

        const score = calculateScore(quiz, answers_questions);

        const submittion = new QuizSubmission({
            quiz_id,
            student_id,
            answers: answers_questions,
            score,
        })

        //save submittion to db 
        await submittion.save();

        await Submission.create({
            student_id,
            course_id,
            type:"quiz",
            submissionRef:submittion._id,
            typeRef: "QuizSubmission"
        })

        res.status(201).json({ message: "Submittion Succesfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function calculateScore(quiz, answers_questions) {
    const question_value = 100 / quiz.questions.length;
    let score = 0
    quiz.questions.forEach(quest => {
        const selectedAnswer = answers_questions.find(answer => answer.question_id === quest._id.toString()).selected_answer;
        if (quest.correct_answer === selectedAnswer) {
            score += question_value;
        }
    });
    return score;
}

//not completed 
//SUBMIT A QUIZ BY STUDENT (POST)
router.post("/homework/:id/submit", async (req, res) => {
    try {
        const homework_id = req.params.id;
        const { student_id, answers,course_id } = req.body;

        //get answers 
        const answers_questions = Object.keys(answers).map(key => {
            const [prefix, question_id] = key.split("-");
            const selected_answer = answers[key];
            return {
                question_id,
                selected_answer: parseInt(selected_answer),
            }
        })

        const quiz = await Quiz.findById(homework_id);

        const score = calculateScore(quiz, answers_questions);

        const submittion = new QuizSubmission({
            homework_id,
            student_id,
            answers: answers_questions,
            score,
        })

        //save submittion to db 
        await submittion.save();

        await Submission.create({
            student_id,
            course_id,
            type:"quiz",
            submissionRef:submittion._id,
            typeRef: "QuizSubmission"
        })

        res.status(201).json({ message: "Submittion Succesfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
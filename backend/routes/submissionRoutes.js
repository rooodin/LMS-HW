const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz");
const router = express.Router();


//Check RESULTS OF QUIZ BY INSTRUCTOR (GET)
router.get("/quizzes/:id/results", authenticateToken, checkRole("instructor"), async (req, res) => {
    try {
        const quiz_id = req.params.id;
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz Not founded!!!" });
        }

        const submissions = await Submission.find({ type: "quiz" })
            .populate({ path: "submissionRef", model: "QuizSubmission", match: { quiz_id, } })
            .exec();

        res.status(200).json(submissions);

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})


//Check RESULTS OF QUIZ BY INSTRUCTOR (GET)
router.get("/homework/:id/results", async (req, res) => {
    try {
        const homework_id = req.params.id;
        const homework = await Quiz.findById(homework_id);
        if (!homework) {
            return res.status(404).json({ message: "Quiz Not founded!!!" });
        }

        const submissions = await Submission.find({ type: "homewrok" })
            .populate({ path: "homeworkRef", model: "HomeworkSubmission", match: { homework_id, } })
            .exec();

        res.status(200).json(submissions);

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;

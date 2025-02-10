
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({



},
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model("User", quizSchema);

module.exports = Quiz;
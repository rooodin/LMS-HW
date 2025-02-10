
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({



},
    {
        timestamps: true,
    }
);

const Submission = mongoose.model("User", submissionSchema);

module.exports = Submission;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      min_length: 5,
      max_length: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      min_length: 2,
      max_length: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min_length: 8,
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

//generate Token

//validation

module.exports = User;

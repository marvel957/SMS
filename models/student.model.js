const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter a student name"],
    },
    email: {
      type: String,
      required: [true, "please enter an email"],
    },
    gpa: {
      type: Number,
      default: 2.0,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);

module.exports = Student;

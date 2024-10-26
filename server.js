const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const Student = require("./models/student.model");

dbURI =
  "mongodb+srv://marvel:donhamsik@cluster0.a1ytynn.mongodb.net/sms?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.send("Welcome to the site");
});
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    return res.status(201).json(student);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({});
    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send("Invalid student id");

    const student = await Student.findById(id);
    return res.status(200).json(student);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const student = await Student.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(400).json({ error: "student not found" });
    }
    return res.status(200).json({ student });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ err: "Missing student" });
    }
    return res.status(200).json({ "successfuly deleteed": student });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("connection successful");
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Error");
  });

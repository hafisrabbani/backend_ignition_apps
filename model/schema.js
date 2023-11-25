const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  title: String,
  description: String,
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

const lessonSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  description: String,
  videoUrl: String,
  classes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
});
const Lesson = mongoose.model("Lesson", lessonSchema);
const Class = mongoose.model("Class", classSchema);

module.exports = { Lesson, Class };

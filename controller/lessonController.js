const mongoose = require("mongoose");
const Lesson = require("../model/schema").Lesson;
const Class = require("../model/schema").Class;

const lessonController = {
  createLesson: async (req, res) => {
    try {
      const { title, thumbnail, videoUrl, description, classId } = req.body;
      const newLesson = new Lesson({ title, thumbnail, videoUrl, description });
      await newLesson.save();
      await Class.findByIdAndUpdate(
        classId,
        { $push: { lessons: newLesson._id } },
        { new: true }
      );

      return res.status(201).json({
        message: "Lesson created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAllLessons: async (req, res) => {
    try {
      const selectedData = ["_id", "title", "thumbnail", "description"];
      const lesson = await Lesson.find({}, selectedData);
      const findClassName = await Class.find({
        lessons: { $in: lesson.map((lesson) => lesson._id) },
      });

      const lessonWithClassName = lesson.map((lesson) => {
        const className = findClassName.find((classItem) =>
          classItem.lessons.includes(lesson._id)
        );
        return {
          id: lesson._id,
          title: lesson.title,
          thumbnail: lesson.thumbnail,
          className: className ? className.title : null,
        };
      });
      res.status(200).json({
        message: "Successfully retrieved all lessons",
        data: lessonWithClassName,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getLessonById: async (req, res) => {
    const { id } = req.params;
    try {
      const lesson = await Lesson.findById(id).populate("classes");
      console.log(lesson);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.status(200).json({
        message: "Successfully retrieved lesson",
        data: lesson,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateLessonById: async (req, res) => {
    const { id } = req.params;
    const { title, thumbnail, videoUrl, description } = req.body;
    try {
      const updatedLesson = await Lesson.findByIdAndUpdate(
        id,
        { title, thumbnail, videoUrl, description },
        { new: true }
      );

      if (!updatedLesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.status(200).json({
        message: "Lesson updated successfully",
        data: updatedLesson,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteLessonById: async (req, res) => {
    const { id } = req.params;
    try {
      const classId = await Lesson.findById(id, "classId");

      const deletedLesson = await Lesson.findByIdAndDelete(id);
      if (!deletedLesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      await Class.findByIdAndUpdate(
        classId,
        { $pull: { lessons: id } },
        { new: true }
      );

      res.status(200).json({
        message: "Lesson deleted successfully",
        data: deletedLesson,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = lessonController;

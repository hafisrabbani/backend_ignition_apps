const Class = require("../model/schema").Class;

const classController = {
  getAllClasses: async (req, res) => {
    try {
      const selectData = ["_id", "title", "description"];
      const classes = await Class.find().select(selectData);
      return res.status(200).json({
        message: "Successfully retrieved all classes",
        data: classes.map((item) => {
          return {
            id: item._id,
            title: item.title,
            description: item.description,
          };
        }),
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createClass: async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Missing parameters" });
      }
      const newClass = new Class({ title, description });
      await newClass.save();
      res.status(201).json({
        message: "Successfully created new class",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  findById: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }
    try {
      const classWithLesson = await Class.findById(id).populate("lessons");
      console.log(classWithLesson);
      if (!classWithLesson) {
        return res.status(404).json({ error: "Class not found" });
      }
      const classesArray = Array.isArray(classWithLesson)
        ? classWithLesson
        : [classWithLesson];

      res.status(200).json({
        message: "Successfully retrieved class",
        data: classesArray.map((item) => {
          return {
            id: item._id,
            title: item.title,
            description: item.description,
            lessons: item.lessons.map((lesson) => {
              return {
                id: lesson._id,
                title: lesson.title,
                thumbnail: lesson.thumbnail,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
              };
            }),
          };
        }),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateClass: async (req, res) => {
    try {
      const { title, description } = req.body;
      await Class.findByIdAndUpdate(
        req.params.id,
        { title, description },
        { new: true }
      );
      res.status(200).json({
        message: "Successfully updated class",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteClass: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }
    try {
      await Class.findByIdAndDelete(id);
      res.status(200).json({
        message: "Successfully deleted class",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = classController;

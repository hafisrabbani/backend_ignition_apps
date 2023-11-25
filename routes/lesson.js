const routes = require("express").Router();
const lessonController = require("../controller/lessonController");

routes.get("/", lessonController.getAllLessons);
routes.post("/", lessonController.createLesson);
routes.get("/:id", lessonController.getLessonById);
routes.patch("/:id", lessonController.updateLessonById);
routes.delete("/:id", lessonController.deleteLessonById);

module.exports = routes;

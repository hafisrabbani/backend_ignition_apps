const routes = require("express").Router();
const classController = require("../controller/classController");

routes.get("/", classController.getAllClasses);
routes.post("/", classController.createClass);
routes.get("/:id", classController.findById);
routes.patch("/:id", classController.updateClass);
routes.delete("/:id", classController.deleteClass);

module.exports = routes;

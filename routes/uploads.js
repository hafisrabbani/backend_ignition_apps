const routes = require("express").Router();
const { uploadFile, getFile } = require("../controller/fileHandlerController");

routes.post("/", uploadFile);
routes.get("/:filePath", getFile);

module.exports = routes;

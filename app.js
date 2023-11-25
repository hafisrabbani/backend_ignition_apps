const express = require("express");
const app = express();
const port = 3001;
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const classRoutes = require("./routes/class");
const lessonRoutes = require("./routes/lesson");
const fileHandlerRoutes = require("./routes/uploads");
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("\nMongoDB Connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/public", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/class", classRoutes);
app.use("/api/v1/lesson", lessonRoutes);
app.use("/api/v1/file", fileHandlerRoutes);
app.listen(port, () => {
  console.log(`\n\nServer is running on port ${port}`);
});

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      data: {
        filePath: req.file.path,
      },
    });
  });
};

const getFile = (req, res) => {
  const filePath = req.params.filePath;
  const host = req.get("host");
  const protocol = req.protocol;
  return res.status(200).json({
    message: "File retrieved successfully",
    data: {
      fileUrl: `${protocol}://${host}/public/${filePath}`,
    },
  });
};

module.exports = {
  uploadFile,
  getFile,
};

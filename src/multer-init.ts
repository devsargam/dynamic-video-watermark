import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const multiUpload = multer({ storage: storage }).fields([
  { name: "plain", maxCount: 1 },
  { name: "watermarked", maxCount: 1 },
]);

export const upload = multer({ storage: storage });

const multer = require("multer");

const avaterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/userAvatars");
  },
  filename: function (req, file, cb) {
    if (file.originalname === "grant.png")
      cb(new Error("Bad file name!"), null);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const userAvatarUpload = multer({
  storage: avaterStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  },
  limits: {
    files: 10,
    fileSize: 1 * 1024 * 1024,
  },
});

// thumbnailImages
const thumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnail") {
      cb(null, "public/images/thumbnail");
    } else if (file.fieldname === "picture") {
      cb(null, "public/images/picture");
    } else {
      cb(new Error("Invalid field name"));
    }
  },
  filename: function (req, file, cb) {
    if (file.originalname === "grant.png")
      cb(new Error("Bad file name!"), null);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const articleTumbnailUpload = multer({
  storage: thumbnailStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  },
  limits: {
    files: 10,
    fileSize: 1 * 1024 * 1024,
  },
});

module.exports = {
  userAvatarUpload,
  articleTumbnailUpload,
};

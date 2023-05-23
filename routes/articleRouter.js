const express = require("express");
const router = express.Router();
const {
  createArticle,
  articlePage,
  getBloggerArticles,
  readArticle,
} = require("../controllers/articleController");
const { articleTumbnailUpload } = require("../utils/multer-settings");

router.get("/", articlePage);
router.post(
  "/create",
  articleTumbnailUpload.single("thumbnail"),
  createArticle
);
router.get("/myArticles", getBloggerArticles);
router.get("/:id", readArticle);
module.exports = router;

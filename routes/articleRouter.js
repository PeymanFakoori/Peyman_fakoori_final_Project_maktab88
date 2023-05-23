const express = require("express");
const router = express.Router();
const {
  createArticle,
  articlePage,
  getBloggerArticles,
  readArticle,
  removeArticle,
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
router.get("/delete/:id", removeArticle);
module.exports = router;

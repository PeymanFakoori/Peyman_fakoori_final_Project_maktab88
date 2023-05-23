const express = require("express");
const router = express.Router();
const {
  createArticle,
  articlePage,
  getBloggerArticles,
  readArticle,
  removeArticle,
  updateArticle,
  getAllArticles,
} = require("../controllers/articleController");
const { articleTumbnailUpload } = require("../utils/multer-settings");

router.get("/", articlePage);
router.post(
  "/create",
  articleTumbnailUpload.single("thumbnail"),
  createArticle
);
router.get("/myArticles", getBloggerArticles);
router.get("/allArticle", getAllArticles);
router.get("/:id", readArticle);
router.get("/delete/:id", removeArticle);
router.post("/update/:id", updateArticle);
module.exports = router;

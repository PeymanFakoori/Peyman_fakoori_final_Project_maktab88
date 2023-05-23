const express = require("express");
const router = express.Router();
const {
  createArticle,
  articlePage,
} = require("../controllers/articleController");

router.get("/", articlePage);
router.post("/", createArticle);

module.exports = router;

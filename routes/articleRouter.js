const express = require("express");
const router = express.Router();
const {
  createArticle,
  articlePage,
} = require("../controllers/articleController");

router.get("/", articlePage);
router.post("/create", createArticle);

module.exports = router;

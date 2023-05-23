const createError = require("http-errors");
const Article = require("../models/Article");

const articlePage = (req, res, _next) => {
  if (req.session.user) return res.render("pages/createArticle");
  res.render("pages/login", {
    errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
  });
};

const createArticle = async (req, res, next) => {
  try {
    const newArticle = new Article({});

    newArticle.title = req.body.title;
    newArticle.thumbnail = "/images/thumbnailPic" + req.file.filename;
    newArticle.content = req.body.content;
    newArticle.author = req.session.user.username;
    newArticle.description = req.body.description;

    await newArticle.save();
    return res.json(newArticle).status(201);
  } catch (error) {
    return next(createError(500, error.message));
  }
};
const getBloggerArticles = async (req, res, next) => {
  try {
    if (!!req.session.user.username) {
      const articles = await Article.find(
        { author: req.session.user.username },
        { __v: 0, updatedAt: 0 }
      );
      res.render("pages/myArticles", { articles: articles });
    } else {
      res.render("pages/login", {
        errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
      });
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
const readArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    res.render("pages/article", { article: article });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createArticle,
  articlePage,
  getBloggerArticles,
  readArticle,
};

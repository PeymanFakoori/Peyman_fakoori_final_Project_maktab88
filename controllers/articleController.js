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
    newArticle.thumbnail = req.body.thumbnail;
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
const removeArticle = async (req, res, next) => {
  try {
    const deletArticle = await Article.findByIdAndRemove(req.params.id);
    res.send("done");
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const updatedArticle = {};

    if (!!req.body.title) updatedArticle.title = req.body.title;
    if (!!req.body.description)
      updatedArticle.description = req.body.description;
    // if (!!req.body.thumbnail) updatedArticle.thumbnail = req.body.thumbnail;
    if (!!req.body.content) updatedArticle.content = req.body.content;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updatedArticle,
      { new: true }
    );
    return res.render("pages/article", { article: article });
  } catch (error) {
    return next(createError(500, "Server Error!"));
  }
};

module.exports = {
  createArticle,
  articlePage,
  getBloggerArticles,
  readArticle,
  removeArticle,
  updateArticle,
};

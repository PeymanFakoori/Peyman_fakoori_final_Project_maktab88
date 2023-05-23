const createError = require("http-errors");
const Article = require("../models/Article");

const articlePage = (req, res, _next) => {
  if (req.session.user) return res.render("pages/article");
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
    newArticle.author = req.body.author;

    if (!!req.body.description) newArticle.description;
    if (!!req.body.contentImages) newArticle.contentImages;

    await newArticle.save();
    return res.json(newArticle).status(201);
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createArticle,
  articlePage,
};

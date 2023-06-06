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
    if (req.session.user) {
      const newArticle = new Article({});

      newArticle.title = req.body.title;
      newArticle.content = req.body.content;
      newArticle.description = req.body.description;
      newArticle.author = req.session.user.username;
      newArticle.thumbnail = "/images/thumbnail" + req.file["thumbnail"][0];
      newArticle.picture = "/images/picture" + req.file["picture"][0];

      await newArticle.save();
      return res.json(newArticle).status(201);
    } else
      res.render("pages/login", {
        errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
      });
  } catch (error) {
    logger.error(error);
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
    if (req.session.user) {
      const article = await Article.findById(req.params.id);
      res.render("pages/article", { article: article });
    } else
      res.render("pages/login", {
        errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
      });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
const removeArticle = async (req, res, next) => {
  try {
    if (req.session.user) {
      const deletArticle = await Article.findByIdAndRemove(req.params.id);
      res.send("done");
    } else
      res.render("pages/login", {
        errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
      });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

const updateArticle = async (req, res, next) => {
  try {
    if (req.session.user) {
      const updatedArticle = {};

      if (!!req.body.title) updatedArticle.title = req.body.title;
      if (!!req.body.description)
        updatedArticle.description = req.body.description;
      if (!!req.body.content) updatedArticle.content = req.body.content;

      if (!!req.files.thumbnail[0]) {
        await fs.unlink(path.join(__dirname, "../public", article.thumbnail));
        updatedArticle.thumbnail =
          "/images/thumbnail" + req.file["thumbnail"][0];
      }

      if (!!req.files.picture) {
        console.log(req.files.picture);
        await fs.unlink(path.join(__dirname, "../public", image));

        updatedArticle.picture = "/images/picture" + req.file["picture"][0];
      }
      const article = await Article.findByIdAndUpdate(
        req.params.id,
        updatedArticle,
        { new: true }
      );
      return res.render("pages/article", { article: article });
    } else
      res.render("pages/login", {
        errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
      });
  } catch (error) {
    return next(createError(500, "Server Error!"));
  }
};

const getAllArticles = async (req, res, next) => {
  try {
    if (req.session.user) {
      const articles = await Article.find({}, { __v: 0, updatedAt: 0 });
      res.render("pages/allArticles", { articles: articles });
    } else
      res.render("pages/login", {
        errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
      });
  } catch (error) {
    return next(createError(500, error.message));
  }
};

module.exports = {
  createArticle,
  articlePage,
  getBloggerArticles,
  readArticle,
  removeArticle,
  updateArticle,
  getAllArticles,
};

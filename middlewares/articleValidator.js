const createError = require("http-errors");

const articleValidator = async (req, res, next) => {
  if (!req.body.title) return next(createError(400, "title is required"));
  if (req.body.title.length < 3)
    return next(createError(400, "title must be at least 3 characters"));

  if (req.body.description && req.body.description.length < 3)
    return next(createError(400, "discription must be at least 3 characters"));

  if (!req.body.thumbnail)
    return next(createError(400, "thumbnail is required"));

  if (!req.body.content) return next(createError(400, "content is required"));
  if (req.body.content.length < 3)
    return next(createError(400, "content must be at least 3 characters"));
};

module.exports = articleValidator;

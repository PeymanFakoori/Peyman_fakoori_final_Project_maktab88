const createError = require("http-errors");

const User = (req, res, next) => {
  try {
    if (!req.body.username)
      return next(createError(400, "please enter username"));

    const checkUsername = user.exists({
      username: req.body.username,
    });

    if (!checkUsername)
      return next(createError(400, "username is not exists!"));

    if (!req.body.password)
      return next(createError(400, "please enter password"));
  } catch (error) {
    console.log(error.message);
  }
  next();
};

module.exports = User;

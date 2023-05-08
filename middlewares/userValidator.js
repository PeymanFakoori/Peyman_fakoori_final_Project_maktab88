const createError = require("http-errors");

const user = require("../models/User");

const userValidator = async (req, res, next) => {
  //firstName
  if (!req.body.firstName)
    return next(createError(400, "firstname is required"));

  if (req.body.firstName.length >= 30 || req.body.firstName.length < 3)
    return next(createError(400, "firstName must be in range(3-30)"));

  if (typeof req.body.firstName !== "string")
    return next(createError(400, "tyoe of firstName must be string"));

  // LastName
  if (!req.body.lastName) return next(createError(400, "lastName is required"));

  if (req.body.lastName.length >= 30 || req.body.lastName.length < 3)
    return next(createError(400, "lastName must be in range(3-30)"));

  if (typeof req.body.lastName !== "string")
    return next(createError(400, "type of lastName must be string"));

  // username
  if (!req.body.username) return next(createError(400, "username is required"));
  const checkUsername = await user.exists({
    username: req.body.username,
  });

  if (checkUsername) return next(createError(400, "username is exists!"));

  // gender
  if (!req.body.gender) req.body.gender = "not-set";

  if (!["male", "female", "not-set"].includes(req.body.gender))
    return next(createError(400, "Your gender is invalid."));

  // password
  if (!req.body.password) {
    return next(createError(400, "password is required!"));
  }

  if (typeof req.body.password !== "string") {
    return next(createError(400, "password must be string!"));
  }

  if (req.body.password.length < 8) {
    return next(createError(400, "password must be at least 8 characters!"));
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(req.body.password)) {
    return next(
      createError(
        400,
        "Enter at least 1 alphabetic character and 1 number for password"
      )
    );
  }

  // phone
  if (!req.body.phone)
    return res.render("signUp", {
      msg: "phone is required",
    });

  if (!req.body.phone.match(/^(\+98|0)?9\d{9}$/))
    return res.render("signUp", {
      msg: "phone is start with 0 or +98 & from iran",
    });

  const checkPhone = await user.findOne({
    phone: req.body.phone,
  });
  if (checkPhone)
    return res.render("signUp", {
      msg: " phone Number is taken!",
    });

  // role
  if (!req.body.role) req.body.role = "user";

  if (!["admin", "user"].includes(req.body.role))
    return next(
      createError(400, "Your role is invalid. role must be admin or user")
    );

  next();
};

module.exports = userValidator;

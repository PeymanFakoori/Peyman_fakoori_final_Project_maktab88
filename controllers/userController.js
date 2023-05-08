const url = require("url");
const User = require("../models/User");
const createError = require("http-errors");

const signUpPage = (req, res, _next) => {
  if (req.session.user) return res.redirect("/user/profile");

  res.render("pages/signUp", {
    errorMessage: req.query.errorMessage ? req.query.errorMessage : null,
  });
};

const registration = async (req, res, _next) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    role: req.body.role,
    gender: req.body.gender,
    avatar: req.body.avatar,
  });
  try {
    await newUser.save();

    res.redirect("/user/login");
  } catch (err) {
    res.render("pages/signUp", { errorMessage: "Server Error!" });
    res.redirect(
      url.format({
        pathname: "/user/register",
        query: {
          errorMessage: "Server Error!",
        },
      })
    );
  }
};

const loginPage = (req, res, _next) => {
  if (req.session.user) return res.redirect("/user/profile");

  const { errorMessage = null } = req.query;

  res.render("pages/login", { errorMessage });
};

const getLogin = async (req, res, _next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.redirect(`/user/login?errorMessage=User not found!`);

    const isMatch = await user.validatePassword(req.body.password);
    if (!isMatch)
      return res.redirect(`/user/login?errorMessage=Password is wrong!`);

    req.session.user = user;
    res.redirect("/user/profile");
  } catch (err) {
    res.redirect(
      url.format({
        pathname: "/user/login",
        query: {
          errorMessage: "Server Error!",
        },
      })
    );
  }
};

const profilePage = (req, res, _next) => {
  let { firstName, lastName, username, password, phone, gender, role, avatar } =
    req.session.user;
  if (!req.session.user) return res.redirect("/user/login");

  res.render("pages/profile", {
    user: {
      firstName,
      lastName,
      username,
      password,
      phone,
      gender,
      role,
      avatar,
    },
  });
};

const updateUser = (req, res, next) => {
  let updatedUser = {};
  const id = req.session.user._id;
  console.log(id);

  if (!!req.body.firstName) updatedUser.firstName = req.body.firstName;
  if (!!req.body.lastName) updatedUser.lastName = req.body.lastName;
  if (!!req.body.password) updatedUser.password = req.body.password;
  if (!!req.body.phone) updatedUser.phone = req.body.phone;
  if (!!req.body.avatar) updatedUser.avatar = req.body.avatar;
  if (!!req.body.gender) updatedUser.gender = req.body.gender;
  if (!!req.body.role) updatedUser.role = req.body.role;

  console.log(req.body);
  User.findByIdAndUpdate(id, updatedUser)
    .then((data) => {
      console.log(data);
      req.session.user = { ...req.session.user, ...updatedUser };
      console.log(req.session.user);
      const {
        firstName,
        lastName,
        username,
        password,
        phone,
        avatar,
        gender,
        role,
      } = req.session.user;
      console.log({
        firstName,
        lastName,
        username,
        password,
        phone,
        avatar,
        gender,
        role,
      });
      res.json({
        firstName,
        lastName,
        username,
        password,
        phone,
        avatar,
        gender,
        role,
      });
    })
    .catch((err) => next(createError(500, err.message)));
};

const logout = (req, res, _next) => {
  req.session.destroy();

  res.redirect("/user/login");
};

const removeUser = (req, res, next) => {
  User.deleteOne({ username: req.session.user.username })
    .then((data) => {
      req.session.destroy();
      res.json(data);
    })
    .catch((err) => next(createError(500, err.message)));
};

module.exports = {
  signUpPage,
  loginPage,
  profilePage,
  registration,
  getLogin,
  logout,
  removeUser,
  updateUser,
};

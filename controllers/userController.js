const createError = require("http-errors");
const fs = require("fs/promises");
const path = require("path");
const User = require("../models/User");
const { userAvatarUpload } = require("../utils/multer-settings");

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
    gender: req.body.gender,
  });
  try {
    await newUser.save();

    res.redirect("/user/login");
  } catch (err) {
    console.log(err.message);
    res.send("err");
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
    res.redirect("/user/login");
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

const uploadAvatar = (req, res, next) => {
  const uploadUserAvatar = userAvatarUpload.single("avatar");
  if (!req.session.user) return res.redirect("/user/login");
  uploadUserAvatar(req, res, async (err) => {
    if (err) {
      //delete if save with error
      // if (req.file) await fs.unlink(path.join(__dirname, "../public", req.file.filename))
      if (err.message) return res.status(400).send(err.message);
      return res.status(500).send("server error!");
    }

    if (!req.file) return res.status(400).send("File not send!");

    try {
      // delete old avatar
      if (req.session.user.avatar) {
        // console.log(req.session.user);
        await fs.unlink(
          path.join(__dirname, "../public", req.session.user.avatar)
        );
      }

      const userss = await User.findByIdAndUpdate(
        req.session.user._id,
        {
          avatar: "/images/userAvatars/" + req.file.filename,
        },
        { new: true }
      );
      // console.log(req.session.user.avatar);
      req.session.user.avatar = userss.avatar;

      // return res.json(user);
      res.redirect("/user/profile");
    } catch (err) {
      return next(createError(500, "Server Error!"));
    }
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
      res.redirect("/user/profile");
    })
    .catch((err) => next(createError(500, err.message)));
};

const logout = (req, res, _next) => {
  req.session.destroy();

  res.redirect("/user/login");
};

const removeUser = async (req, res, next) => {
  try {
    const deletUser = await User.findByIdAndRemove(req.session.user._id);
    req.session.destroy();
    res.redirect("/user/signup");
  } catch (error) {
    return next(createError(500, error.message));
  }
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
  uploadAvatar,
};

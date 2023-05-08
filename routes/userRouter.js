const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userValidator = require("../middlewares/userValidator");
const User = require("../middlewares/User");

const {
  signUpPage,
  registration,
  loginPage,
  profilePage,
  getLogin,
  logout,
  removeUser,
  updateUser,
} = require("../controllers/userController");

router.get("/signup", signUpPage);
router.post("/signup", userValidator, registration);

router.get("/login", loginPage);
router.post("/login", User, getLogin);

router.get("/profile", profilePage);

router.get("/logout", logout);

router.patch("/", updateUser);

router.delete("/", deleteUser);

module.exports = router;

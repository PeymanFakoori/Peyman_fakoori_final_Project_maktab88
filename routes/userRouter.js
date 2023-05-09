const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userValidator = require("../middlewares/userValidator");
const User = require("../middlewares/userValidator");
const {
  signUpPage,
  registration,
  loginPage,
  profilePage,
  getLogin,
  logout,
  removeUser,
  updateUser,
  bulkUpload,
  uploadAvatar,
} = require("../controllers/userController");

router.get("/signup", signUpPage);
router.post("/signup", userValidator, registration);

router.get("/login", loginPage);
router.post("/login", User, getLogin);

router.get("/profile", profilePage);

router.get("/logout", logout);

router.post("/uploadAvatar", uploadAvatar);

router.post("/bulkUpload", bulkUpload);

router.patch("/", userValidator, updateUser);

router.delete("/", removeUser);

module.exports = router;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      minLength: [3, "firstName must have at least 3 characters"],
      maxLength: [30, "firstName must have most 30 characters"],
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      minLength: [3, "lastName must have at least 3 characters"],
      maxLength: [30, "lastName must have most 30 characters"],
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "This username has already been taken"],
      trim: true,
      minLength: [3, "username must have at least 3 charecters"],
      maxLength: [30, "username must have most 30 characters"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must have at least 8 characters"],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "1 letter and 1 Number is required in password and at leaat with 8 characters",
      ],
    },
    gender: {
      type: String,
      enum: ["male", "female", "not-set"],
      default: "not-set",
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["blogger", "admin"],
      default: "blogger",
      lowercase: true,
    },
    avatar: {
      type: String,
      default: "user-default-avatar",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model("user", UserSchema);

const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minLength: [3, "title must be at least 3 characters"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "thumbnail is required"],
    },
    content: {
      type: String,
      required: [true, "content is required"],
      minLength: [1, "content must be at least  characters"],
    },
    picture: {
      type: [String],
    },
    author: {
      type: String,
      ref: "User",
      required: [true, "author is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("article", ArticleSchema);

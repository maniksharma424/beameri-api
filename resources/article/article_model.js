import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Article = model("article", ArticleSchema);
export default Article;

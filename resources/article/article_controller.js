import Article from "./article_model.js";
import { cloudinaryConfig } from "../../util/cloudinary.js";

class ArticleController {
  static getArticles = async (req, res) => {
    try {
      const articles = await Article.find();

      return res.status(200).json({
        status: "success",
        message: "Articles found",
        data: articles,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal server error",
        error : error.message,
      });
    }
  };

  static getArticleById = async (req, res) => {
    const { articleId } = req.params;
    if (!articleId) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide article ID",
      });
    }
    try {
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({
          status: "failed",
          message: "Article not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Article found",
        data: article,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal server error",
        error : error.message,
      });
    }
  };

  static addArticle = async (req, res) => {
    try {
      var article = req.body;
      console.log(article);
      if (req.files && req.files.image) {
        const result = await cloudinaryConfig(
          req.files.image.tempFilePath,
          "image"
        );
        article.imageUrl = result.url;
      }
      if (req.files && req.files.video) {
        const result = await cloudinaryConfig(
          req.files.video.tempFilePath,
          "video"
        );
        article.videoUrl = result.url;
      }
      const articleSaved = await Article.create(article);
      return res.status(201).json({
        status: "success",
        message: "Article created",
        data: articleSaved,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        error : error.message,
        message: "Internal server error",
      });
    }
  };

  static updateArticle = async (req, res) => {
    const { articleId } = req.params;
    if (!articleId) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide article ID",
      });
    }
    try {
      var article = req.body;

      if (req.files && req.files.image) {
        const result = await cloudinaryConfig(
          req.files.image.tempFilePath,
          "image"
        );
        article.imageUrl = result.url;
      }
      if (req.files && req.files.video) {
        const result = await cloudinaryConfig(
          req.files.video.tempFilePath,
          "video"
        );
        article.videoUrl = result.url;
      }
      const savedArticle = await Article.findByIdAndUpdate(articleId, article, {
        new: true,
      });
      if (!article) {
        return res.status(404).json({
          status: "failed",
          message: "Article not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Article updated",
        data: savedArticle,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error : error.message,
        message: "Internal server error",
      });
    }
  };

  static deleteArticle = async (req, res) => {
    const { articleId } = req.params;
    if (!articleId) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide article ID",
      });
    }
    try {
      const article = await Article.findByIdAndDelete(articleId);
      if (!article) {
        return res.status(404).json({
          status: "failed",
          message: "Article not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Article deleted",
        data: article,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error : error.message,
        message: "Internal server error",
      });
    }
  };
}

export default ArticleController;

import { Router } from "express";
import ArticleController from "./article_controller.js";
import { checkUserPermission } from "../../util/user_right.js";
import { checkUserAuth } from "../../util/jwt.js";

const router = Router();

router.route("/get-articles").get(ArticleController.getArticles);
router.route("/get-article/:articleId").get(ArticleController.getArticleById);
router.route("/add-article").post(checkUserAuth, (req, res, next) => checkUserPermission(req, res, next, "create"), ArticleController.addArticle);
router.route("/update-article/:articleId").put(checkUserAuth, (req, res, next) => checkUserPermission(req, res, next, "update"), ArticleController.updateArticle);
router
  .route("/delete-article/:articleId")
  .delete(checkUserAuth, (req, res, next) => checkUserPermission(req, res, next, "delete"), ArticleController.deleteArticle);
export default router;

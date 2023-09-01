import { Router } from "express";
import multer from "multer";
const upload = multer();

import ChapGptController from "./gpt_controller.js";

const router = Router();
router.route("/").post(ChapGptController.askQuery);
// router.route("/voice").post(ChapGptController)

export default router;

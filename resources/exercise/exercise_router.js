import { Router } from "express";

import ExerciseController from "./ecercise_controller.js";
import { checkUserAuth } from "../../util/jwt.js";
import { isUserAdmin } from "../../util/isUSerAdmin.js";
import { checkUserPermission } from "../../util/user_right.js";

const router = Router();
router.route("/add-exercise").post(
  // cpUpload,
  checkUserAuth,
  (req, res, next) => checkUserPermission(req, res, next, "create"),
  ExerciseController.createExercise
);
router.route("/get-exercises").get(ExerciseController.getExercise);
router
  .route("/get-exercise/:exerciseId")
  .get(checkUserAuth, (req, res, next) => checkUserPermission(req, res, next, "read"), ExerciseController.getExerciseById);

router
  .route("/update-exercise/:exerciseId")
  .put(checkUserAuth, checkUserAuth, (req, res, next) => checkUserPermission(req, res, next, "update"), ExerciseController.updateExercise);
router
  .route("/delete-exercise/:exerciseId")
  .delete(checkUserAuth, (req, res, next) => checkUserPermission(req, res, next, "delete"), ExerciseController.deleteExercise);

export default router;

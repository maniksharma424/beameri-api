import { Router } from "express";
import AvatarController from "./avatar_controller.js";
import { checkUserAuth } from "../../util/jwt.js";
import { isUserAdmin } from "../../util/isUSerAdmin.js";

const router = Router();
router
  .route("/")
  .post(checkUserAuth, isUserAdmin, AvatarController.createAvatar);
router.route("/").get(AvatarController.getAllAvatars);
router.route("/active").get(AvatarController.getAllActiveAvatars);
router.route("/:id").get(AvatarController.getAvatarById);
router
  .route("/:id")
  .put(checkUserAuth, isUserAdmin, AvatarController.updateAvatar);
router
  .route("/status/:id")
  .put(checkUserAuth, isUserAdmin, AvatarController.activateAvatar);
router
  .route("/:id")
  .delete(checkUserAuth, isUserAdmin, AvatarController.deleteAvatar);
export default router;

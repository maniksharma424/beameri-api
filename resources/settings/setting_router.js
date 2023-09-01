import { Router } from "express";
import SettingController from "./setting_controller.js";
import { isUserAdmin } from "../../util/isUSerAdmin.js";
import { checkUserAuth } from "../../util/jwt.js";

const router = Router();

router.route("/").get(SettingController.getSetting);
router.route("/gst").post(checkUserAuth, isUserAdmin, SettingController.addGST);
router
  .route("/social")
  .post(checkUserAuth, isUserAdmin, SettingController.addSocialMedia);
router
  .route("/address")
  .post(checkUserAuth, isUserAdmin, SettingController.addAddress);
router
  .route("/scrollText")
  .post(checkUserAuth, isUserAdmin, SettingController.addScrollText);
router
  .route("/logo")
  .post(checkUserAuth, isUserAdmin, SettingController.addLogo);
router
  .route("/about")
  .post(checkUserAuth, isUserAdmin, SettingController.addAbout);
router
  .route("/company-name")
  .post(checkUserAuth, isUserAdmin, SettingController.addCompanyName);
router
  .route("/app-name")
  .post(checkUserAuth, isUserAdmin, SettingController.addApplicationName);
router
  .route("/delete")
  .delete(checkUserAuth, isUserAdmin, SettingController.deleteSetting);

export default router;

import { Router } from "express";

import { checkUserAuth } from "../../util/jwt.js";
import AuthUserServices from "../../util/auth.js";
import { checkUserPermission } from "../../util/user_right.js";
import { isUserAdmin } from "../../util/isUSerAdmin.js";
import UserController from "./user_controllers.js";

const router = Router();

router
  .route("/update-password")
  .post(checkUserAuth, AuthUserServices.updatePassword);
router.route("/forgot-password").post(AuthUserServices.forgotPassOtp);
router.route("/verify-otp").post(AuthUserServices.verifyOtp);
router.route("/reset-password").post(AuthUserServices.changePasswordOtp);
router.route("/").post(checkUserAuth, UserController.fetchUser);
router
  .route("/role/:userId")
  .put(checkUserAuth, isUserAdmin, UserController.updateUser);
router
  .route("/dashboard")
  .get(checkUserAuth, isUserAdmin, UserController.dashboardDetails);
router
  .route("/create")
  .post(checkUserAuth, isUserAdmin, UserController.createUserByAdmin);

export default router;

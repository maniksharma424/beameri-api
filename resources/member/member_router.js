import { Router } from "express";
import { checkUserAuth } from "../../util/jwt.js";
import MemberController from "./member_controller.js";
import { isUserManager, isUserAdmin } from "../../util/isUSerAdmin.js";

const router = Router();
router
  .route("/get-all-members")
  .get(checkUserAuth, isUserAdmin, MemberController.getAllMembers);
router
  .route("/add-member/:branchId")
  .post(checkUserAuth, isUserManager, MemberController.addMember);
router
  .route("/update-member/:memberId")
  .put(checkUserAuth, isUserManager, MemberController.updateMember);
router
  .route("/delete-member/:memberId")
  .delete(checkUserAuth, isUserManager, MemberController.deleteMember);
router
  .route("/get-members/:branchId")
  .get(checkUserAuth, MemberController.getMembers);
router
  .route("/get-member/:memberId")
  .get(checkUserAuth, MemberController.getMember);
export default router;

import { Router } from "express";

import branchController from "./branch_controller.js";
import { checkUserAuth } from "../../util/jwt.js";
import { isUserAdmin, isUserManager } from "../../util/isUSerAdmin.js";

const router = Router();
router.route("/get-all-branches").get(branchController.getBranches);
router.route("/get-branch/:branchId").get(branchController.getBranchById);
router
  .route("/add-branch")
  .post(checkUserAuth, isUserAdmin, branchController.addBranchToGym);
router
  .route("/delete-branch/:branchId")
  .delete(checkUserAuth, isUserAdmin, branchController.deleteBranch);
router
  .route("/update-branch/:branchId")
  .put(checkUserAuth, isUserAdmin, branchController.updateBranch);
router
  .route("/get-branch-id")
  .get(checkUserAuth, isUserManager, branchController.getBranchId);

export default router;

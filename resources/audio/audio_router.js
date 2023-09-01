import { Router } from "express";
import AudioController from "./audio_controller.js";
import { checkUserAuth } from "../../util/jwt.js";
import { isUserAdmin } from "../../util/isUSerAdmin.js";

const router = Router();
router.route("/").post(checkUserAuth, isUserAdmin, AudioController.createAudio);
router.route("/").get(AudioController.getAllAudios);
router.route("/active").get(AudioController.getAllActiveAudios);
router.route("/:id").get(AudioController.getAudioById);
router
  .route("/:id")
  .put(checkUserAuth, isUserAdmin, AudioController.updateAudio);
router
  .route("/status/:id")
  .put(checkUserAuth, isUserAdmin, AudioController.activateAudio);
router
  .route("/:id")
  .delete(checkUserAuth, isUserAdmin, AudioController.deleteAudio);
export default router;

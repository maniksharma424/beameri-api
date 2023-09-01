import { Router } from "express";
import ElevenLabsController from "./eleven_labs_controller.js";

const router = Router();

router.route("/text-to-speak").post(ElevenLabsController.textToSpeak);
router.route("/add").post(ElevenLabsController.addVoice);
router.route("/").get(ElevenLabsController.getVoices);

// active voice all
router.route("/active-voice").get(ElevenLabsController.activeAllVoice);

router
  .route("/active-voice-update/:id")
  .put(ElevenLabsController.activateVoiceStatus);

router
  .route("/active-voice-delete/:id")
  .delete(ElevenLabsController.deleteVoiceStatus);

export default router;

import { Router } from "express";

import VoiceController from "./voice_controller.js";

const router = Router();
router.route("/").delete(VoiceController.deleteVoiceFromPlayht);
router.route("/").post(VoiceController.createVoiceClone);
router.route("/audio").post(VoiceController.createVoiceCloneByUploadAudio);
router.route("/upload").post(VoiceController.uploadAudioOnCloudnary);
router.route("/clone").post(VoiceController.cloneVoiceFromHuggingFace);
router.route("/").get(VoiceController.getAllVoiceListFromPlayhtFun);

export default router;

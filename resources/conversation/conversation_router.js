import { Router } from "express";
import ConversationController from "./conversation_controller.js";

const router = Router();

router.route("/").get(ConversationController.getAllConversation);
router.route("/:id").get(ConversationController.getConversationById);

router.route("/create").post(ConversationController.createConversation);
router.route("/update/:id").put(ConversationController.updateConversation);

export default router;

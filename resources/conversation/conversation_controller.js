import Conversation from "./conversation_model.js";

class ConversationController {
  static async createConversation(req, res) {
    if (!req.body.question) {
      return res.status(400).json({
        status: "failed",
        message: "question is required",
      });
    }

    try {
      const conversation = await Conversation.create({
        qa: {
          question: req.body.question,
          answer: "",
        },
      });

      // check device
      const device = req.device.type.toUpperCase();
      conversation.source = device;
      await conversation.save();
      return res.status(201).json({
        status: "success",
        message: "conversation created successfully",
        data: conversation,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
  static async updateConversation(req, res) {
    if (!req.body.answer || !req.params.id) {
      return res.status(400).json({
        status: "failed",
        message: "id and answer is required",
      });
    }

    try {
      if (req.params.id) {
        const conversation = await Conversation.findOne({ _id: req.params.id });
        conversation.qa.answer = req.body.answer;
        await conversation.save();
        return res.status(201).json({
          status: "success",
          message: "conversation updated successfully",
          data: conversation,
        });
      } else {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getAllConversation(req, res) {
    try {
      const conversation = await Conversation.find({});
      return res.status(200).json({
        status: "success",
        message: "conversation retrieved successfully",
        data: conversation,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getConversationById(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const conversation = await Conversation.findById(req.params.id);
      if (!conversation) {
        return res.status(404).json({
          status: "failed",
          message: "conversation not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "conversation retrieved successfully",
        data: conversation,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
}

export default ConversationController;

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ConversationSchema = new Schema(
  {
    qa: {
      question: {
        type: String,
      },
      answer: {
        type: String,
      },
    },
    source: {
      type: String,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Conversation = model("Conversation", ConversationSchema);
export default Conversation;

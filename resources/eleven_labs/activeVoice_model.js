import mongoose from "mongoose";
const { Schema, model } = mongoose;

const VoiceActiveShcema = new Schema(
  {
    voice_id: {
      type: String,
      
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
     name: {
      type: String,
    },
     voice_name: {
      type: String,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const VoiceActive = model("voiceActive", VoiceActiveShcema);
export default VoiceActive;


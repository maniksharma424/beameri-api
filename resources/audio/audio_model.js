import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const AudioSchema = new Schema(
  {
    audioUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Audio = model("audio", AudioSchema);
export default Audio;

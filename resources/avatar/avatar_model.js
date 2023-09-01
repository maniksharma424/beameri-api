import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const AvatarSchema = new Schema(
  {
    imageUrl: {
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

const Avatar = model("avatar", AvatarSchema);
export default Avatar;

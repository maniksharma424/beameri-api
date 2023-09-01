import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const MemberSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    phone: {
      type: Number,
    },
    branch: {
      type: SchemaTypes.ObjectId,
      ref: "branch",
      required: true,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Member = model("member", MemberSchema);

export default Member;

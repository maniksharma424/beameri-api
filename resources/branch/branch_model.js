import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const BranchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    branchManagerEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    qrCode: {
      type: String,
    },
    name: {
      type: String,
    },
    city: {
      type: String,
    },
    contact: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Branch = model("branch", BranchSchema);

export default Branch;

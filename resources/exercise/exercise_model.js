import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ExerciseSchema = new Schema(
  {
    name: {
      type: String,
    },
    difficultyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    videoUrl: String,
    imageUrl: String,
    description: String,
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Exercise = model("exercise", ExerciseSchema);

export default Exercise;

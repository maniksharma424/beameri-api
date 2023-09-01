import Exercise from "./exercise_model.js";
import { cloudinaryConfig } from "../../util/cloudinary.js";

class ExerciseController {
  static async getExercise(req, res) {
    try {
      const exercise = await Exercise.find();
      res.status(200).json({
        status: "success",
        data: exercise,
        message: "exercise fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  static async getExerciseById(req, res) {
    try {
      const exercise = await Exercise.findById(req.params.exerciseId);
      if (!exercise) {
        return res.status(404).json({
          status: "failed",
          message: "exercise not found",
        });
      }
      res.status(200).json({
        status: "success",
        data: exercise,
        message: "exercise fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  static async createExercise(req, res) {
    var exerc = req.body;
    console.log(exerc);

    try {
      if (req.files && req.files.image) {
        // console.log(req.files);

        const localpath = req.files.image.tempFilePath;
        const result = await cloudinaryConfig(localpath, "image");
        console.log("result", result);

        exerc.imageUrl = result.url;
      }
      if (req.files && req.files.video) {
        const video = await cloudinaryConfig(
          req.files.video.tempFilePath,
          "video"
        );
        exerc.videoUrl = video.url;
      }
      const exercise = await Exercise.create(exerc);
      res.status(200).json({
        status: "success",
        data: exercise,
        message: "exercise created successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  static async updateExercise(req, res) {
    var exerc = req.body;
    try {
      if (req.files && req.files.image) {
        // console.log(req.files);

        const localpath = req.files.image.tempFilePath;
        const result = await cloudinaryConfig(localpath, "image");
        console.log("result", result);

        exerc.imageUrl = result.url;
      }
      if (req.files && req.files.video) {
        const video = await cloudinaryConfig(
          req.files.video.tempFilePath,
          "video"
        );
        exerc.videoUrl = video.url;
      }
      const exercise = await Exercise.findByIdAndUpdate(
        req.params.exerciseId,
        exerc,
        {
          new: true,
        }
      );
      if (!exercise) {
        return res.status(404).json({
          status: "failed",
          message: "exercise not found",
        });
      }
      res.status(200).json({
        status: "success",
        data: exercise,
        message: "exercise updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  static async deleteExercise(req, res) {
    try {
      const exercise = await Exercise.findByIdAndDelete(req.params.exerciseId);
      if (!exercise) {
        return res.status(404).json({
          status: "failed",
          message: "exercise not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "exercise deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default ExerciseController;

import Audio from "./audio_model.js";
import { cloudinaryConfig } from "../../util/cloudinary.js";

class AudioController {
  static async createAudio(req, res) {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({
        status: "failed",
        message: "audioUrl is required",
      });
    }
    const result = await cloudinaryConfig(
      req.files.audio.tempFilePath,
      "video"
    );
    try {
      const audio = await Audio.create({
        audioUrl: result.url,
        status: "inactive",
      });
      return res.status(201).json({
        status: "success",
        message: "audio created successfully",
        data: audio,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getAllAudios(req, res) {
    try {
      const audios = await Audio.find();
      return res.status(200).json({
        status: "success",
        message: "audios retrieved successfully",
        data: audios,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getAllActiveAudios(req, res) {
    try {
      const audios = await Audio.find({ status: "active" });
      return res.status(200).json({
        status: "success",
        message: "audios retrieved successfully",
        data: audios,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getAudioById(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const audio = await Audio.findById(req.params.id);
      if (!audio) {
        return res.status(404).json({
          status: "failed",
          message: "audio not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "audio retrieved successfully",
        data: audio,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async updateAudio(req, res) {
    try {
      if (!req.params.id || !req.files || !req.files.audio) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const result = await cloudinaryConfig(
        req.files.audio.tempFilePath,
        "video"
      );
      const audio = await Audio.findOneAndUpdate(
        { _id: req.params.id },
        { audioUrl: result.url },
        { new: true }
      );

      if (!audio) {
        return res.status(404).json({
          status: "failed",
          message: "audio not found",
        });
      }
      //   const updatedAudio = await Audio.findByIdAndUpdate(
      //     req.params.id,
      //     req.body,
      //     { new: true }
      //   );
      return res.status(200).json({
        status: "success",
        message: "audio updated successfully",
        data: audio,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async deleteAudio(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const audio = await Audio.findByIdAndDelete(req.params.id);
      if (!audio) {
        return res.status(404).json({
          status: "failed",
          message: "audio not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "audio deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async activateAudio(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      await Audio.updateMany({ _id: { $ne: id } }, { status: "inactive" });

      await Audio.findByIdAndUpdate(id, { status: "active" });
      return res.status(200).json({
        status: "success",
        message: "audio activated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
}

export default AudioController;

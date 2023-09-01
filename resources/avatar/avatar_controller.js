import Avatar from "./avatar_model.js";
import { cloudinaryConfig } from "../../util/cloudinary.js";

class AvatarController {
  static async createAvatar(req, res) {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        status: "failed",
        message: "imageUrl is required",
      });
    }
    const result = await cloudinaryConfig(
      req.files.image.tempFilePath,
      "image"
    );
    try {
      const avatar = await Avatar.create({
        imageUrl: result.url,
        status: "inactive",
      });
      return res.status(201).json({
        status: "success",
        message: "avatar created successfully",
        data: avatar,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getAllAvatars(req, res) {
    try {
      const avatars = await Avatar.find();
      return res.status(200).json({
        status: "success",
        message: "avatars retrieved successfully",
        data: avatars,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getAllActiveAvatars(req, res) {
    try {
      const avatars = await Avatar.find({ status: "active" });
      return res.status(200).json({
        status: "success",
        message: "avatars retrieved successfully",
        data: avatars,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async getAvatarById(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const avatar = await Avatar.findById(req.params.id);
      if (!avatar) {
        return res.status(404).json({
          status: "failed",
          message: "avatar not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "avatar retrieved successfully",
        data: avatar,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async updateAvatar(req, res) {
    try {
      if (!req.params.id || !req.files || !req.files.image) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const result = await cloudinaryConfig(
        req.files.image.tempFilePath,
        "image"
      );
      const avatar = await Avatar.findOneAndUpdate(
        { _id: req.params.id },
        { imageUrl: result.url },
        { new: true }
      );

      if (!avatar) {
        return res.status(404).json({
          status: "failed",
          message: "avatar not found",
        });
      }
      const updatedAvatar = await Avatar.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json({
        status: "success",
        message: "avatar updated successfully",
        data: updatedAvatar,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async deleteAvatar(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const avatar = await Avatar.findById(req.params.id);
      if (!avatar) {
        return res.status(404).json({
          status: "failed",
          message: "avatar not found",
        });
      }
      await Avatar.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        status: "success",
        message: "avatar deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  static async activateAvatar(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      await Avatar.updateMany({ _id: { $ne: id } }, { status: "inactive" });

      await Avatar.findByIdAndUpdate(id, { status: "active" });
      return res.status(200).json({
        status: "success",
        message: "avatar activated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
}

export default AvatarController;

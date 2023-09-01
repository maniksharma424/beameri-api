import axios from "axios";
import { json } from "express";
import { config, uploader } from "cloudinary";
import fs from "fs";
import ActiveVoice from "./activeVoice_model.js";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

import cloudinary from "cloudinary";

class ElevenLabsController {
  static textToSpeak = async (req, res) => {
    const text = req.body.text;

    var voiceId;

    if (req.body.voiceId == null || req.body.voiceId == "")
      voiceId = "2EiwWnXFnvU5JabPnv8n"; // default voice
    else voiceId = req.body.voiceId;

    // console.log("VoiceId " + voiceId);

    const headers = {
      Accept: "audio/mpeg",
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    };

    const body = {
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    };
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        body,
        {
          headers: headers,
          responseType: "arraybuffer", // This is important for handling binary data
        }
      );
      cloudinary.v2.config({
        cloud_name: "dolqf9s3y",
        api_key: "946358445313778",
        api_secret: "vic0vSFgD7_Z7-viUc49VzfHN30",
      });

      const audioBuffer = response.data;
      const tempFilePath = "./tmp/temp_audio.mp3";
      fs.writeFileSync(tempFilePath, audioBuffer);

      const uploadResult = await cloudinary.v2.uploader.upload(
        tempFilePath,
        {
          resource_type: "raw", // Since you're uploading binary data
          folder: "myfolder/neonflake/gym", // Optional: Specify a folder in Cloudinary
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
          } else {
            console.log("Upload to Cloudinary successful:", result);
          }
        }
      );

      // Get the audio URL from the Cloudinary response
      const audioUrl = uploadResult.secure_url;

      res.status(200).json({
        status: "success",
        data: uploadResult.secure_url,
        type: "binary",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: "failed",
        data: e.message,
      });
    }
  };

  static addVoice = async (req, res) => {
    const name = req.body.voice_name;
    const voice = req.files.audio;
    if (!voice || !name) {
      return res.status(400).json({
        status: "failed",
        data: "Invalid voice or name",
      });
    }
    const headers = {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "Multipart/form-data",
    };
    const filePath = req.files.audio.tempFilePath;
    const fileBuffer = fs.readFileSync(filePath);
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: "audio/mpeg" });
    formData.append("files", blob, req.files.audio.name);
    formData.append("name", name);

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/voices/add`,
        formData,
        {
          headers: headers,
        }
      );
       // save to voice model
   
      await ActiveVoice.create({voice_name:voice.name,voice_id:response?.data?.voice_id,namee:req.body.name})
      
      res.status(200).json({
        status: "success",
        data: response.data,
      });
    } catch (e) {
      res.status(500).json({
        status: "failed",
        data: e,
      });
    }
  };

  static getVoices = async (req, res) => {
    const { name } = req.query;
    const headers = {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(`https://api.elevenlabs.io/v1/voices`, {
        headers: headers,
      });

      const voice =
        name != null
          ? response.data.voices.filter((voice) => voice.name === name)
          : response.data;

      res.status(200).json({
        status: "success",
        data: voice,
      });
    } catch (e) {
      res.status(500).json({
        status: "failed",
        data: e,
      });
    }
  };



   // Active voice
  static activeAllVoice = async (req, res) => {
    try {
      const avatars = await ActiveVoice.find();
      return res.status(200).json({
        status: "success",
        message: "voice retrieved successfully",
        data: avatars,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  };

  static activateVoiceStatus = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      await ActiveVoice.updateMany(
        { _id: { $ne: id } },
        { status: "inactive" }
      );

      await ActiveVoice.findByIdAndUpdate(id, { status: "active" });
      return res.status(200).json({
        status: "success",
        message: "voice activated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  };

    static async deleteVoiceStatus(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }
      const avatar = await ActiveVoice.findById(req.params.id);
      if (!avatar) {
        return res.status(404).json({
          status: "failed",
          message: "voice not found",
        });
      }
      await ActiveVoice.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        status: "success",
        message: "voice deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }
  
  
}

export default ElevenLabsController;

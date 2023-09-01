// packages
import express, { urlencoded, json } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

// module
import path from "path";
import { config } from "dotenv";
import { connect } from "./util/db.js";
import AuthUserServices from "./util/auth.js";
import User from "./resources/user/user_model.js";
import branchRouter from "./resources/branch/branch_router.js";
import exerciseRouter from "./resources/exercise/exercise_router.js";
import userRouter from "./resources/user/user_router.js";
import memberRouter from "./resources/member/member_router.js";
import articleRouter from "./resources/article/article_router.js";
import settingRouter from "./resources/settings/setting_router.js";
import VoiceController from "./resources/ml_functionality/voice_controller.js";
import ChapGptController from "./resources/ml_functionality/gpt_controller.js";
import playItRouter from "./resources/ml_functionality/router.js";
import gptRouter from "./resources/ml_functionality/router_chat_gpt.js";
import axios from "axios";
import FormData from "form-data";
import { chatGptResponse } from "./resources/ml_functionality/gpt_controller.js";
import avatarRouter from "./resources/avatar/avatar_router.js";
import audioRouter from "./resources/audio/audio_router.js";
import elevenlabsRouter from "./resources/eleven_labs/eleven_labs_router.js";
import fs from "fs";

import cloudinary from "cloudinary";

config();
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;
export const userModel = (req, res, next) => {
  req.model = User;
  next();
};

app.post("/auth/signup", userModel, AuthUserServices.signup);
app.post("/auth/signin", userModel, AuthUserServices.signin);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// const storage = multer.memoryStorage();

// const upload = multer({
//   dest: "uploads/", // Specify the directory where uploaded files will be stored
// });

app.use("/api/exercise", exerciseRouter);
// branch
app.use("/api/branch", branchRouter);
app.use("/api/member", userModel, memberRouter);
app.use("/api/article", articleRouter);
app.use("/api/settings", settingRouter);
app.use("/api/chatgpt", gptRouter);
app.post("/api/clone-voice", VoiceController.cloneVoiceFromHuggingFace);
app.use("/api/playht", playItRouter);
app.use("/api/avatar", avatarRouter);
app.use("/api/audio", audioRouter);
app.use("/api/elevenlabs", elevenlabsRouter);
// user routes
app.use("/user", userModel, userRouter);

app.get("/", (req, res) => {
  res.json("Server is Running ");
});

app.post("/chatgpt/upload", async (req, res) => {
  console.log("req.file", req.files.audio);
  const url = "https://api.openai.com/v1/audio/transcriptions";

  if (!req.files.audio) {
    return res.status(400).json({
      status: "failed",
      error: "Invalid audio file",
    });
  }
  try {
    const filePath = req.files.audio.tempFilePath;
    const fileBuffer = fs.readFileSync(filePath);
    const formData = new FormData();
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    };
    formData.append("file", fileBuffer, req.files.audio.name);
    formData.append("model", "whisper-1");
    const data = await axios.post(url, formData, config);
    console.log("data", data);
    const gptResponse = await chatGptResponse(data.data.text);
    return res.json({
      status: "success",
      data: gptResponse.response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      data: e,
    });
  }
});

app.post("/elevenlabs/text-to-speak", async (req, res) => {
  const text = req.body.text;

  var voiceId;

  if (req.body.voiceId == null || req.body.voiceId == "")
    voiceId = "21m00Tcm4TlvDq8ikWAM"; // default voice
  else voiceId = req.body.voiceId;

  // console.log("VoiceId " + voiceId);

  const headers = {
    Accept: "audio/mpeg",
    "xi-api-key": process.env.ELEVENLABS_API_KEY,
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
    const tempFilePath = "/tmp/temp_audio.mp3";
    fs.writeFileSync(tempFilePath, audioBuffer);

    const uploadResult = await cloudinary.v2.uploader.upload(
      tempFilePath,
      {
        resource_type: "raw",
        folder: "myfolder/neonflake/gym",
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
});

const __dirname = path.resolve();

export const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      // if (SECRETS.node_env === "development") {
      //   expressListRoutes(app);
      // }
      console.log(`REST API on http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

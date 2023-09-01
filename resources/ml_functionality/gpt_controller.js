import axios from "axios";
// import Readable from "stream";
import { Configuration, OpenAIApi } from "openai";
import Exercise from "../exercise/exercise_model.js";
// const upload = multer();
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import mic from "mic";
import { Readable } from "stream";

import ffmpegPath from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function chatGptResponse(query) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: query },
      ],
    });

    console.log("GPT Response:", response.data.choices[0].message);
    const gptResponse = response.data.choices[0].message.content.trim();
    return {
      status: "success",
      response: gptResponse,
    };
  } catch (error) {
    console.error("Error communicating with the GPT API:", error.message);
    return { error: "Oops! Something went wrong." };
  }
}

class ChapGptController {
  static askQuery = async (req, res) => {
    console.log("askQuery ", req.body);
    const query = req.body.query;
    const exercise = await Exercise.findOne({});

    if (!query) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required parameter: query",
      });
    }
    const response = await chatGptResponse(
      `${query} here is the data ${exercise}`
    );
    return res.status(200).json(response);
  };

  static askQueryV;
}

export default ChapGptController;

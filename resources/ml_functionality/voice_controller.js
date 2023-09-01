import axios from "axios";

import { cloudinaryConfig } from "../../util/cloudinary.js";
//
// 5beb79d5d613410cbcde40fb4e2335fd
const newHeaders = {
  Authorization: `Bearer ${"5beb79d5d613410cbcde40fb4e2335fd"}`,
  "X-USER-ID": "WC6tyYGOcFbn1Dvxqn92kMQ78Od2",
  accept: "text/event-stream",
  // accept: "application/json",
  "content-type": "application/json",
};

async function getAllVoiceListFromPlayht() {
  const options = {
    method: "GET",
    url: "https://play.ht/api/v2/cloned-voices",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
      "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
    },
  };
  try {
    var response = await axios.request(options);

    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
  return null;
}

async function createVoiceClone(voice, voice_name) {
  const formData = new FormData();
  const url = `https://play.ht/api/v2/cloned-voices/`;

  if (voice) {
    const voices = await getAllVoiceListFromPlayht();

    console.log("length : ", voices.length);
    if (voices != null && voices.length > 4) {
      const response = await axios.delete(url, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
          "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
        },
        data: {
          voice_id: voices[0].id,
        },
      });
    }
  }

  formData.append(
    "sample_file_url",
    voice != null
      ? voice
      : "https://peregrine-results.s3.amazonaws.com/pigeon/BUKc6X4lIhhjsc1zEZ_0.mp3"
  );
  formData.append("voice_name", voice_name != null ? voice_name : "my_voice");

  console.log("formData", formData);

  const options = {
    method: "POST",
    url: "https://play.ht/api/v2/cloned-voices/instant/",
    headers: {
      accept: "application/json",
      "content-type": "multipart/form-data",
      AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
      "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
    },
    data: formData,
  };
  console.log("yaha tak thik h");
  const response = await axios(options);
  console.log("yaha tak thik h 22");
  console.log(response.data);
  return response.data;
}

class VoiceController {
  static async cloneVoiceFromHuggingFace(req, res) {
    const voice = req.body.voice;
    const text = req.body.text;
    if (text == null) {
      return res.status(400).json({ message: "voice or text is null" });
    }
    try {
      // const voice = "larry";
      const options = {
        method: "POST",
        url: "https://play.ht/api/v2/tts",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
          "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
        },
        data: {
          quality: "medium",
          output_format: "mp3",
          speed: 1,
          sample_rate: 24000,
          text: text,
          voice:
            voice != null
              ? voice
              : "s3://voice-cloning-zero-shot/e2ee110d-86a6-415c-ad55-04f1a2e5af76/sap/manifest.json",
        },
      };

      console.log(options);

      const response = await axios.request(options);

      console.log("response", response.data);

      // Handle the response data here
      if (response.status === 201) {
        // handle audio mp3
        const id = response.data?.id;
        const resp = await axios.get(
          `https://play.ht/api/v2/tts/${id}?format=audio-mp3`,
          { headers: newHeaders }
        );

        if (resp.status === 200) {
          const events = resp?.data.split("\r\n\r\n");
          const urls = [];

          for (const event of events) {
            if (event.includes("event: completed")) {
              // Extract the URL from the completed event
              const match = event.match(/data: (.*)/);
              if (match) {
                const eventData = JSON.parse(match[1]);
                if (eventData.url) {
                  urls.push(eventData.url);
                }
              }
            }
          }
          return res.status(200).json({
            status: "success",
            message: "Audio generated successfully",
            audioUrl: urls,
          });
        } else {
          return res.status(404).json({
            status: "failed",
            message: "No audio found",
          });
        }
      } else {
        return res.status(404).json({
          status: "failed",
          message: "No audio found",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error });
    }
  }

  static deleteVoiceFromPlayht = async (req, res) => {
    try {
      var voice = req.body.voice;
      if (voice == null) {
        voice = await getAllVoiceListFromPlayht();
      }
      console.log(voice);
      const url = `https://play.ht/api/v2/cloned-voices/`;
      const response = await axios.delete(url, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
          "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
        },
        data: {
          voice_id: voice,
        },
      });

      console.log(response);
      if (response.status === 200) {
        return res.status(200).json({ message: "delete success" });
      } else {
        return res.status(401).json({ message: "delete fail" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  };

  static createVoiceClone = async (req, res) => {
    try {
      const response = await createVoiceClone(
        req.body.voice,
        req.body.voice_name
      );
      console.log(response.data);
      return res.status(200).json({
        status: "success",
        data: response.data,
      });
    } catch (error) {
      console.error(error);
      return res.status(200).json({
        error: error,
        status: "failed",
      });
    }
  };

  static uploadAudioOnCloudnary = async (req, res) => {
    try {
      if (!req.files || !req.files.audio) {
        return res.status(400).json({ message: "No files were uploaded." });
      }
      const localpath = req.files.audio.tempFilePath;
      const result = await cloudinaryConfig(localpath, "video");
      console.log(result);
      if (req.body.uploadOnly) {
        return res.status(200).json({
          status: "success",
          data: result.url,
        });
      }
      const response = await createVoiceClone(
        result.url,
        req.body.voice_name != null ? req.body.voice_name : "myvoice"
      );

      return res.status(200).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      console.error(error);
      return res.status(200).json({
        error: error,
        status: "failed",
      });
    }
  };

  static createVoiceCloneByUploadAudio = async (req, res) => {
    console.log("file data : ", req.files, "body : ", req.body);
    try {
      var sample_file = req.files.audio;
      var voice_name = req.body.voice_name;
      const options = {
        method: "POST",
        url: "https://play.ht/api/v2/cloned-voices/instant",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
          "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
        },
        data: {
          sample_file: sample_file.data,
          voice_name: voice_name != null ? voice_name : "my_voice",
        },
      };
      var response = await axios.request(options);
      console.log(response.data);
      const id = response.data.id;
      if (response.status == 201) {
        return res.status(200).json({
          status: "success",
          data: response.data,
        });
      } else {
        return res.status(200).json({
          status: "failed",
          data: response.data,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(200).json({
        status: "failed",
        data: e.message,
      });
    }
  };

  static getAllVoiceListFromPlayhtFun = async (req, res) => {
    console.log("getAllVoiceListFromPlayhtFun");
    const options = {
      method: "GET",
      url: "https://play.ht/api/v2/cloned-voices",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AUTHORIZATION: "Bearer 1d7714790c714eba80524c84712e94bf",
        "X-USER-ID": "oqVKPMxGKde9IVCbaCfVXKGzftI2",
      },
    };
    try {
      var response = await axios.request(options);

      console.log(response.data);
      const id = response.data[0].id;
      return res.status(200).json({
        status: "success",
        data: response.data,
      });
    } catch (e) {
      console.log(e);
      res.status(200).json({
        success: "failed",
        error: e,
      });
    }
  };
}

export default VoiceController;

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SettingsSchema = new Schema(
  {
    companyName: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    gst: {
      type: Number,
    },
    socialMedia: {
      type: [
        {
          name: String,
          link: String,
          image: String,
        },
      ],
      default: [],
    },
    logo: {
      type: {
        Adminlogo: String,
        Headerlogo: String,
        Footerlogo: String,
      },
      default: {},
    },
    applicationName: {
      type: String,
    },
    aboutCompany: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Settings = model("settings", SettingsSchema);

export default Settings;

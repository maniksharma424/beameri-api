import mongoose from "mongoose";

export const connect = async (url = process.env.MONGO_CONNECTION_STRING) => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("Connection to Beameri MongoDB successful!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};


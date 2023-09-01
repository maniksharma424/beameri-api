import { config, uploader } from "cloudinary";
var dataurl;
const cloudinaryConfig = async (locaFilePath, type) => {
  config({
    cloud_name: "dolqf9s3y",
    api_key: "946358445313778",
    api_secret: "vic0vSFgD7_Z7-viUc49VzfHN30",
  });
  try {
    console.log("type", type);
    if (type === "image") {
      return uploader
        .upload(locaFilePath, {
          resource_type: "image",
          folder: "myfolder/neonflake/gym",
        })
        .then((result) => {
          const image = result;
          return image;
        });
    } else if (type === "video") {
      return new Promise((resolve) => {
        uploader.upload(
          locaFilePath,
          (result) => {
            resolve({ url: result.url, id: result.public_id });
          },
          { resource_type: "auto" }
        );
      });
      //   uploader
      //     .upload(locaFilePath, {
      //       resource_type: "auto",
      //       folder: "myfolder/neonflake/gym",
      //       // chunk_size: 6000000,
      //       eager: [
      //         { width: 300, height: 300, crop: "pad", audio_codec: "none" },
      //         {
      //           width: 160,
      //           height: 100,
      //           crop: "crop",
      //           gravity: "south",
      //           audio_codec: "none",
      //         },
      //       ],
      //       eager_async: true,
      //     })
      //     .then((result) => {
      //       const video = result;
      //       console.log("video", video);
      //       return video;
      //     });
    }
  } catch (err) {
    console.log(err);
    // res.status(400).json({
    // messge: 'someting went wrong while processing your request',
    // data: {
    // err
    // }
    // });
    return null;
  }
};
export { dataurl, cloudinaryConfig };

// import cloudinary from "cloudinary";
// cloudinary.v2.config({
//   cloud_name: "dolqf9s3y",
//   api_key: "946358445313778",
//   api_secret: "vic0vSFgD7_Z7-viUc49VzfHN30",
// });
// export default cloudinary;

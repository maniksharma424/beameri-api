// import multer from "multer";
// import * as path from "path";

// // const storage = multer.diskStorage({});
// const storage = multer.diskStorage({
//   //multers disk storage settings
//   // destination: function (req, file, cb) {
//   //   cb(null, path.join(__dirname, "uploads"));
//   // },
//   // filename: function (req, file, cb) {
//   //   var datetimestamp = Date.now();
//   //   cb(
//   //     null,
//   //     file.fieldname +
//   //       "-" +
//   //       datetimestamp +
//   //       "." +
//   //       file.originalname.split(".")[file.originalname.split(".").length - 1]
//   //   );
//   // },
// });
// const multerUploads = multer({ storage: storage });
// // const multerUploads = multer({
// //   //multer settings
// //   storage: storage,
// //   // limits: {
// //   //   fileSize: 1024 * 1024,
// //   // },
// // }).array("profile", 4);
// export { multerUploads };

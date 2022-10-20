
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const wrapper = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

module.exports = {
<<<<<<< HEAD
  uploadRecruiter: (req, res, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Hirea App/recruiter",
      },
    });

    const fileFilter = (request, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
      }
    };

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: 500_000 },
    }).single("image");
    // eslint-disable-next-line consistent-return
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(res, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(res, 401, err.message, null);
      }

      // Everything went fine.
      next();
=======
  uploadImagePortfolio: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Hirea App/Portfolio",
      },
    });
    const upload = multer({ storage }).single("image");
    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }

      // Everything went fine.
      return next();
>>>>>>> c2e2bd5bb675fba09435c73e5acddbcbc37d7aab
    });
  },
};

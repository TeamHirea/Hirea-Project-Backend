const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const wrapper = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadRecruiter: (req, res, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "recruiter",
      },
    });

    const fileFilter = (request, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        return cb(null, true);
      }
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
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
    });
  },
  uploadJobseeker: (req, res, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "jobseeker",
      },
    });

    const fileFilter = (request, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        return cb(null, true);
      }
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
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
    });
  },
  uploadImagePortfolio: (req, res, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "Portfolio",
      },
    });

    const fileFilter = (request, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        return cb(null, true);
      }
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg format allowed!"));
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
    });
  },
};

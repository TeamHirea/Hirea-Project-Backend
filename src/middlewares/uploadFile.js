const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const wrapper = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

module.exports = {
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
    });
  },
};

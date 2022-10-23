const wrapper = require("../utils/responseHandler");
const portfolioModel = require("../models/portfolio");
const cloudinary = require("../config/cloudinary");

module.exports = {
  createPortfolio: async (request, response) => {
    try {
      let filename;
      if (request.file) {
        filename = request.file.filename;
      }

      const { idJobseeker, url, title } = request.body;
      const setData = {
        idJobseeker,
        url,
        title,
        image: filename || "",
      };
      await portfolioModel.createPortfolio(setData);
      // get data portfolio
      const getDataPortfolio = await portfolioModel.getPortfolioByTitle(title);

      return wrapper.response(
        response,
        200,
        "Success Create Portfolio",
        getDataPortfolio.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;

      return wrapper.response(response, status, statusText, errorData);
    }
  },
  updatePortfolio: async (request, response) => {
    try {
      const { id } = request.params;

      const { title, url } = request.body;

      const checkId = await portfolioModel.getPortfolioById(id);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      let setData = {
        url,
        title,
      };
      if (request.file) {
        const { filename } = request.file;
        setData = { ...setData, image: filename || "" };
        cloudinary.uploader.destroy(checkId.data[0].image, (result) => result);
      }

      await portfolioModel.updatePortfolio(id, setData);
      const result = await portfolioModel.getPortfolioById(id);

      return wrapper.response(
        response,
        200,
        "Success Update Portfolio",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getPortfolioByIdJobseeker: async (request, response) => {
    try {
      const { idJobseeker } = request.params;

      const result = await portfolioModel.getPortfolioByIdJobseeker(
        idJobseeker
      );

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `portfolio By Id ${idJobseeker} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get portfolio By Id Jobseeker",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;

      return wrapper.response(response, status, statusText, errorData);
    }
  },
  deletePortfolio: async (request, response) => {
    try {
      const { id } = request.params;

      const checkId = await portfolioModel.getPortfolioById(id);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${id} Not Found`,
          []
        );
      }

      cloudinary.uploader.destroy(checkId.data[0].image, (result) => result);
      await portfolioModel.deletePortfolio(id);

      return wrapper.response(response, 200, "Success Delete Portfolio", null);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};

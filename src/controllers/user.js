const userModel = require("../models/user");
const wrapper = require("../utils/responseHandler");

module.exports = {
  getAllJobSeekers: async (request, response) => {
    try {
      let { page, limit, search, column, order } = request.query;
      page = +page || 1;
      limit = +limit || 5;
      search = search || "";
      column = column || "skill";
      order = order === "true";

      if (page < 1) {
        page = 1;
      }

      if (limit < 1) {
        limit = 5;
      }

      const countingParams = { search };
      const totalData = await userModel.getCountJobSeekers(countingParams);
      // console.log(totalData);

      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, limit, totalData, totalPage };
      const offset = page * limit - limit;

      const setData = { offset, limit, column, order, countingParams };

      const result = await userModel.getAllJobSeekers(setData);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          "No Job Seeker found on database!",
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get All Job Seeker",
        result.data,
        pagination
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
  getJobSeekerById: async (request, response) => {
    try {
      const { id: userId } = request.params;

      const result = await userModel.getJobSeekersById(userId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `User with given id is not found!`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get User",
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
};
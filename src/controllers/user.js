/* eslint-disable camelcase */
const userModel = require("../models/user");
const wrapper = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

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
  getRecruiterById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.getRecruiterById(id);
      return wrapper.response(
        res,
        user.status,
        "success get data recruiter by id",
        user.data
      );
    } catch (error) {
      const { status, statusText, error: errorData } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
  updateUserRecruiter: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        location,
        about,
        instagram,
        linkedin,
        company,
        companyField,
        phone,
      } = req.body;

      const user = await userModel.getRecruiterById(id);

      if (user.data.length === 0) {
        return wrapper.response(res, 404, "cannot find user", null);
      }

      const image = req.file?.filename || "";
      const setData = {
        name,
        location,
        about,
        instagram,
        linkedin,
        company,
        companyField,
        phone,
        image,
      };
      if (image) {
        cloudinary.uploader.destroy(user?.data[0]?.image, () => {});
      }
      const recruiter = await userModel.updateRecruiter(id, setData);
      return wrapper.response(
        res,
        recruiter.status,
        "success update profile recruiter",
        recruiter.data
      );
    } catch (error) {
      const { status, statusText, error: errorData } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
  updateUserJobseeker: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        job,
        location,
        instagram,
        github,
        gitlab,
        description,
        job_type,
      } = req.body;

      const user = await userModel.getJobSeekersById(id);

      if (user.data.length === 0) {
        return wrapper.response(res, 404, "cannot find user", null);
      }

      const image = req.file?.filename || "";
      const setData = {
        name,
        job,
        location,
        instagram,
        github,
        gitlab,
        description,
        job_type,
        image,
      };
      if (image) {
        cloudinary.uploader.destroy(user?.data[0]?.image);
      }
      const jobseeker = await userModel.updateJobseeker(id, setData);
      return wrapper.response(
        res,
        jobseeker.status,
        "success update profile recruiter",
        jobseeker.data
      );
    } catch (error) {
      const { status, statusText, error: errorData } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};

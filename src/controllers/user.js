/* eslint-disable camelcase */
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const wrapper = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

module.exports = {
  getAllJobSeekers: async (request, response) => {
    try {
      let { page, limit, column, order } = request.query;
      page = +page || 1;
      limit = +limit || 5;
      column = column || "skill";
      order = order === "true";
      let { search } = request.query || "";

      if (search) {
        search = search.split(",");
      } else {
        search = [];
      }

      if (page < 1) {
        page = 1;
      }

      if (limit < 1) {
        limit = 5;
      }

      const totalData = await userModel.getCountJobSeekers(search);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, limit, totalData, totalPage };
      const offset = page * limit - limit;

      const setData = { offset, limit, column, order, search };

      const result = await userModel.getAllJobSeekers(setData);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          "No Job Seeker with given query found on database!",
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
  updatePasswordJobSeeker: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId);
      const { confirmPassword, oldPassword, newPassword } = req.body;
      if (!confirmPassword || !oldPassword || !newPassword) {
        return wrapper.response(res, 401, "some field still empty", null);
      }
      const user = await userModel.getJobSeekersById(userId);
      const salt = await bcrypt.genSalt(12);
      const checkOldPassword = await bcrypt.compare(
        oldPassword,
        user.data[0].password
      );
      if (!checkOldPassword) {
        return wrapper.response(res, 401, "Wrong Old Password Input", null);
      }
      if (newPassword !== confirmPassword) {
        return wrapper.response(res, 401, "Password did not match", null);
      }
      const updatePassword = await userModel.updateJobseeker(userId, {
        password: await bcrypt.hash(newPassword, salt),
        created_at: new Date(),
      });
      const filterObj = ["id", "created_at"];

      const filtered = Object.keys(updatePassword.data[0])
        .filter((key) => filterObj.includes(key))
        .reduce(
          (obj, key) => ({
            ...obj,
            [key]: user.data[0][key],
          }),
          {}
        );
      return wrapper.response(res, 200, "Password Success updated", filtered);
    } catch (error) {
      console.log(error);
      const { status, statusText, error: errorData } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};

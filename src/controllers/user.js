/* eslint-disable camelcase */
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const wrapper = require("../utils/responseHandler");
const cloudinary = require("../config/cloudinary");

module.exports = {
  getAllJobSeekers: async (request, response) => {
    try {
<<<<<<< HEAD
      let { page, limit, column, order, search } = request.query;
      page = +page || 1;
      limit = +limit || 5;
      column = column || "skills_backup";
      order = order === "true"; // converting given string to boolean
      search = search || "";

      console.log(search);
      if (search) {
        search = search.split(",");
      } else {
        search = []; // if the search keyword is empty string or undefined, assign empty array to variable `search`
      }
      // search = search.map((item) => item.toUpperCase());
=======
      let { page, limit, column, order } = request.query;
      const { filter } = request.query;
      page = +page || 1;
      limit = +limit || 5;
      column = column || "name";
      order = order || "ASC"; // converting given string to boolean
      let { search } = request.query || "";
      search = search || "";
>>>>>>> b95ed3c5c0fa26b28c8c178fe9ae87cec98a3fae

      if (page < 1) {
        page = 1; // set page to 1 if user gave minus value
      }

      if (limit < 1) {
        limit = 5; // set page to 1 if user gave minus value
      }

      const offset = page * limit - limit;

      const setData = { offset, limit, column, order, search, filter };

      const countResult = await userModel.getCountJobSeekers(setData);
      const result = await userModel.pgGetAllJobSeekers(setData);
      // console.log(result);

      const totalData = countResult.rowCount;
      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, limit, totalData, totalPage };

      const searchResult = [];

      const getUser = async (user) => {
        try {
          const checkUser = await userModel.searchJobSeekersById(user.id);
          await searchResult.push(checkUser.data[0]);
        } catch (error) {
          // console.log(error);
        }
      };

      await Promise.all(
        result.rows.map(async (item) => {
          await getUser(item);
        })
      );

      if (searchResult.length < 1) {
        return wrapper.response(
          response,
          404,
          "No Job Seeker with given query found on database!",
          []
        );
      }

      return wrapper.response(
        response,
        200,
        "Success Get All Job Seeker",
        searchResult,
        pagination
      );
    } catch (error) {
      console.log(error);
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
      const { status, statusText, error: errorData } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};

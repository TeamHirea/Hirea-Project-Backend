const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const wrapper = require("../utils/responseHandler");
const userModel = require("../models/user");

module.exports = {
  signupRecruiter: async (request, response) => {
    try {
      const {
        name,
        email,
        company,
        companyField,
        phone,
        password,
        confirmPassword,
      } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);
      //   Hashing Password
      const hashedPassword = await bcrypt.hash(password, 10);

      const setData = {
        name,
        email,
        company,
        companyField,
        phone,
        password: hashedPassword,
      };
      // Check Confirm Password
      if (password !== confirmPassword) {
        return wrapper.response(response, 400, "Wrong Confirm Password", null);
      }

      if (!confirmPassword) {
        return wrapper.response(
          response,
          400,
          "Please Confirm Your Password",
          null
        );
      }
      console.log(setData);

      // check email in database
      if (checkEmail.data.length > 0) {
        return wrapper.response(
          response,
          400,
          "Email is Already Registered",
          null
        );
      }
      // save data by model
      const result = await userModel.createRecruiter(setData);
      console.log(result.data);

      return wrapper.response(
        response,
        200,
        "Success Register Please Check Your Email",
        result
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

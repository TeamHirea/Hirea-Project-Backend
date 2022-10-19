const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      const result = userModel
        .createRecruiter(setData)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      // const result = await userModel.createRecruiter(setData);

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
  signinRecretuier: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length < 1) {
        return wrapper.response(res, 404, "Wrong email input", null);
      }

      const validate = await bcrypt.compare(
        password,
        checkEmail.data[0].password
      );

      // 2. PROSES PENCOCOKAN PASSWORD
      if (!validate) {
        return wrapper.response(res, 401, "Wrong Password!", null);
      }

      if (checkEmail.data[0].statusUser !== "active") {
        return wrapper.response(res, 401, "Verify your email first", null);
      }

      const payload = {
        userId: checkEmail.data[0].userId,
        role: !checkEmail.data[0].role ? "user" : checkEmail.data[0].role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // membuat refresh token
      const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
        expiresIn: "36h",
      });
      // 4. PROSES REPON KE USER
      return wrapper.response(res, 200, "Success Login", {
        userId: payload.userId,
        token,
        refreshToken,
      });
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};

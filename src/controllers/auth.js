const random = require("simple-random-number-generator");

const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const wrapper = require("../utils/responseHandler");
const userModel = require("../models/user");
const client = require("../config/redis");

const { sendEmail } = require("../utils/nodemailer");

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
        role: "recruiter",
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
      await userModel.createRecruiter(setData);
      // get data user
      const getDataUser = await authModel.getRecruiterByEmail(email);
      delete getDataUser.data[0].password;

      const userId = getDataUser.data[0].id;
      const otp = random({
        min: 100000,
        max: 999999,
        integer: true,
      });

      // mailing
      const setMailOptions = {
        email,
        title: "Hirea Apps",
        greeting: "Hello",
        name,
        subject: "Email Verification !",
        subtitle: "Email Verification",
        message: "Please confirm your OTP by clicking the link",
        otp,
        template: "template-1.html",
        button: `http://localhost:8080/api/auth/verify/${otp}`,
      };

      await sendEmail(setMailOptions);

      // save OTP in redis
      client.setEx(`otp:${otp}`, 3600, userId);

      return wrapper.response(
        response,
        200,
        "Success Register Please Check Your Email",
        { id: userId }
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
  verify: async (request, response) => {
    try {
      const { otp } = request.params;

      const checkOTP = await client.get(`otp:${otp}`);
      const today = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      if (!checkOTP) {
        return wrapper.response(response, 403, "Wrong OTP", null);
      }

      const setData = {
        activatedAt: today,
      };
      const result = await userModel.updateUser(checkOTP, setData);

      client.del(`otp:${otp}`);
      return wrapper.response(
        response,
        result.status,
        "Success Verified, Please Login",
        { userId: checkOTP }
      );
    } catch (error) {
      // console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  signupJobSeeker: async (request, response) => {
    try {
      const { name, email, phone, password, confirmPassword } = request.body;
      const checkEmail = await authModel.getJobseekerByEmail(email);
      //   Hashing Password
      const hashedPassword = await bcrypt.hash(password, 10);

      const setData = {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "jobseeker",
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
      await userModel.createJobSeeker(setData);

      // get data user
      const getDataUser = await authModel.getJobseekerByEmail(email);
      console.log(getDataUser);
      delete getDataUser.data[0].password;

      const userId = getDataUser.data[0].id;
      // const otp = random({
      //   min: 100000,
      //   max: 999999,
      //   integer: true,
      // });

      // mailing
      // const setMailOptions = {
      //   email,
      //   title: "Hirea Apps",
      //   greeting: "Hello",
      //   name,
      //   subject: "Email Verification !",
      //   subtitle: "Email Verification",
      //   message: "Please confirm your OTP by clicking the link",
      //   otp,
      //   template: "template-1.html",
      //   button: `http://localhost:8080/api/auth/verify/${otp}`,
      // };

      // await sendEmail(setMailOptions);

      // save OTP in redis
      // client.setEx(`otp:${otp}`, 3600, userId);

      return wrapper.response(
        response,
        200,
        "Success Register Please Check Your Email",
        { id: userId }
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
};

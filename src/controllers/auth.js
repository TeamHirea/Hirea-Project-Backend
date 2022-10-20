const random = require("simple-random-number-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
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
      const checkEmail = await authModel.getRecruiterByEmail(email);
      const checkJobseeker = await authModel.getJobseekerByEmail(email);
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
      // check email if recruiter already register as jobseeker

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
        url: `http://localhost:8080/api/auth/verifyRecruiter/${otp}`,
        button: "Click Me",
      };

      await sendEmail(setMailOptions);
      // save OTP in redis

      client.client.setEx(`otpRecruiter:${otp}`, 3600, userId);


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
  verifyRecruiter: async (request, response) => {
    try {
      const { otp } = request.params;

      const checkOTP = await client.client.get(`otpRecruiter:${otp}`);

      const today = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });

      if (!checkOTP) {
        return wrapper.response(response, 403, "Wrong OTP", null);
      }

      const setData = {
        activatedAt: today,
        statusUser: "active",
      };

      const result = await userModel.updateRecruiter(checkOTP, setData);

      client.client.client.del(`otp:${otp}`);
      return wrapper.response(
        response,
        result.status,
        "Success Verified, Please Login",
        { userId: checkOTP }
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
  verifyjobseeker: async (request, response) => {
    try {
      const { otp } = request.params;
      const checkOTP = await client.client.client.get(`otpJobseeker:${otp}`);
      const today = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });

      if (!checkOTP) {
        return wrapper.response(response, 403, "Wrong OTP", null);
      }

      const setData = {
        activated_at: today,
        statusUser: "active",
      };

      const result = await userModel.updateJobseeker(checkOTP, setData);


      client.del(`otpJobseeker:${otp}`);

      return wrapper.response(
        response,
        result.status,
        "Success Verified, Please Login",
        { userId: checkOTP }
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
  signupJobSeeker: async (request, response) => {
    try {
      const { name, email, phone, password, confirmPassword } = request.body;
      const checkEmail = await authModel.getJobseekerByEmail(email);
      const checkRecruiter = await authModel.getRecruiterByEmail(email);

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
      // check email if jobseeker already register as recruiter

      // save data by model
      await userModel.createJobSeeker(setData);

      // get data user
      const getDataUser = await authModel.getJobseekerByEmail(email);

      delete getDataUser.data[0].password;

      const userId = getDataUser.data[0].id;
      const otp = random({
        min: 100000,
        max: 999999,
        integer: true,
      });

      // mailing;
      const setMailOptions = {
        email,
        title: "Hirea Apps",
        greeting: "Hello",
        name,
        subject: "Email Verification !",
        subtitle: "Email Verification",
        message: "Please confirm your OTP by clicking the link",
        otp,
        template: "template-2.html",
        url: `http://localhost:8080/api/auth/verifyJobSeeker/${otp}`,
        button: "Click Me",
      };

      await sendEmail(setMailOptions);

      // save OTP in redis
      client.client.client.setEx(`otpJobseeker:${otp}`, 3600, userId);

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
  signinJobseeker: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!validator.isEmail(email)) {
        return wrapper.response(res, 401, "invalid email format", null);
      }
      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getJobseekerByEmail(email);
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
      };

      const token = jwt.sign(payload, process.env.JWT_PRIVATE_ACCESS_KEY, {
        expiresIn: "1d",
      });

      // membuat refresh token
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_PRIVATE_REFRESH_KEY,
        {
          expiresIn: "36h",
        }
      );
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
  signinRecruiter: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!validator.isEmail(email)) {
        return wrapper.response(res, 401, "invalid email format", null);
      }
      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getRecruiterByEmail(email);
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
      };

      const token = jwt.sign(payload, process.env.JWT_PRIVATE_ACCESS_KEY, {
        expiresIn: "1d",
      });

      // membuat refresh token
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_PRIVATE_REFRESH_KEY,
        {
          expiresIn: "36h",
        }
      );
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
  forgotPassword: async (req, res) => {
    try {
    const { email } = req.body;
    const findEmailRecruiter = await authModel.getRecruiterByEmail(email);
    const findEmailJobseeker = await authModel.getJobseekerByEmail(email);
    const generateOtp = Math.floor(100000 + Math.random() * 900000);
    if(findEmailJobseeker.data.length === 0 && findEmailRecruiter.data.length === 0){
      return wrapper.response(
        res,
        200,
        "email not existed. please register first",
        null
      );
    }
      if(findEmailRecruiter.data.length === 0){
        findEmail = findEmailJobseeker;
        if(!findEmail.data.length){
          return wrapper.response(
            res,
            200,
            "email not exist",
            null
          );
        }
        const setMailOptions = {
          email,
          title: "Hirea Apps",
          greeting: "Hello",
          name : findEmail.data[0].name,
          subject: "Forgot Password !",
          subtitle: "Forgot Password",
          message: "Please confirm your OTP by clicking the link",
          otp : generateOtp,
          template: "template-1.html",
          button: `http://localhost:8080/api/auth/forgotPassword/${generateOtp}`,
        };

        await sendEmail(setMailOptions);
  
        await client.client.setEx(
          `forgotPasswordJobSeekerOTP:${generateOtp}`,
          3600,
          JSON.stringify({ userId: findEmail.data[0].id })
          );
          
       
        return wrapper.response(
          res,
          200,
          "Process success please check your email",
          [{ email: findEmail.data[0].email }]
        );
      }

      findEmail = findEmailRecruiter;
      if(!findEmail.data.length){
        return wrapper.response(
          res,
          200,
          "email not exist",
          null
        );
      }
      const setMailOptions = {
        email,
        title: "Hirea Apps",
        greeting: "Hello",
        name : findEmail.data[0].name,
        subject: "Forgot Password !",
        subtitle: "Forgot Password",
        message: "Please confirm your OTP by clicking the link",
        otp : generateOtp,
        template: "template-1.html",
        button: `http://localhost:8080/api/auth/forgotPassword/${generateOtp}`,
      };

      await sendEmail(setMailOptions);

      await client.client.setEx(
      `forgotPasswordOTP:${generateOtp}`,
      3600,
      JSON.stringify({ userId: findEmail.data[0].id })
      );

      return wrapper.response(
        res,
        200,
        "Process success please check your email",
        [{ email: findEmail.data[0].email }]
      );
      
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { otp } = req.params;
      const { newPassword, confirmPassword } = req.body;
      let resetPasswordOtp;
      resetPasswordOtp = await client.client.get(`forgotPasswordJobSeekerOTP:${otp}`) ? await client.client.get(`forgotPasswordJobSeekerOTP:${otp}`) : await client.client.get(`forgotPasswordOTP:${otp}`)
      console.log(resetPasswordOtp)
      const userReset = JSON.parse(resetPasswordOtp);
      
      if (!resetPasswordOtp) {
        return wrapper.response(
          res,
          404,
          "otp can't be used, please do forgot password process first!",
          null
        );
      }

      if (newPassword !== confirmPassword) {
        return wrapper.response(
          res,
          401,
          "your new password and confirm password, did not match",
          null
        );
      }
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(newPassword, salt);

      const setData = {
        password: encrypted,
      };

 

      let user;
      if(await client.client.get(`forgotPasswordOTP:${otp}`)){
        user = await userModel.updateRecruiter(userReset.userId, setData)
        await client.client.del(`forgotPasswordOTP:${otp}`);
      } else {
        user = await userModel.updateJobseeker(userReset.userId, setData)
        await client.client.del(`forgotPasswordJobSeekerOTP:${otp}`);
      }

      return wrapper.response(res, 200, "success reset password ", {
        userId: user.data[0].id,
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};

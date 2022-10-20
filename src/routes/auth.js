const express = require("express");

const authController = require("../controllers/auth");
// const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post("/register/recruiter", authController.signupRecruiter);
Router.post("/register/jobseeker", authController.signupJobSeeker);
Router.post("/signin/jobseeker", authController.signinJobseeker);
Router.get("/verify/:otp", authController.verify);
Router.get("/verifyJobseeker/:otp", authController.verifyjobseeker);

module.exports = Router;

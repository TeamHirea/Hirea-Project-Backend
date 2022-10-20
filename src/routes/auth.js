const express = require("express");

const authController = require("../controllers/auth");
// const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post("/register/recruiter", authController.signupRecruiter);
Router.post("/register/jobseeker", authController.signupJobSeeker);
Router.post("/signin/jobseeker", authController.signinJobseeker);
Router.post("/signin/recruiter", authController.signinRecruiter);

Router.get("/verifyRecruiter/:otp", authController.verifyRecruiter);
Router.post("/forgotPassword", authController.forgotPassword)
Router.post("/resetPassword/:otp", authController.resetPassword)
Router.get("/verifyJobseeker/:otp", authController.verifyjobseeker);

module.exports = Router;

const express = require("express");

const authController = require("../controllers/auth");
// const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post("/register/recruiter", authController.signupRecruiter);
Router.get("/verify/:otp", authController.verify);

module.exports = Router;

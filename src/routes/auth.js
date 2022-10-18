const express = require("express");
const authController = require("../controllers/auth");
// const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post("/register/recruiter", authController.signupRecruiter);
module.exports = Router;

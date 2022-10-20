const express = require("express");

const userController = require("../controllers/user");
const uploadFile = require('../middlewares/uploadFile')
const middleware = require('../middlewares/auth')

const Router = express.Router();

// get all user
Router.get("/", userController.getAllJobSeekers);

// get user/jobseeker by id
Router.get("/:id", userController.getJobSeekerById);
Router.get("/recruiter/:id",middleware.authentication, userController.getRecruiterById);
Router.patch(`/recruiter/:id`,uploadFile.uploadRecruiter, userController.updateUserRecruiter)
module.exports = Router;

const express = require("express");

const userController = require("../controllers/user");
const uploadFile = require('../middlewares/uploadFile')

const Router = express.Router();

// get all user
Router.get("/", userController.getAllJobSeekers);

// get user/jobseeker by id
Router.get("/:id", userController.getJobSeekerById);
Router.get("/recruiter/:id", userController.getRecruiterById);
Router.patch(`/recruiter/:id`,uploadFile.uploadRecruiter, userController.updateUserRecruiter)
module.exports = Router;

const express = require("express");

const Router = express.Router();
const experienceController = require("../controllers/experience");

// update experience
Router.patch("/:id", experienceController.updateJobSeekerExperience);
Router.delete("/:id", experienceController.updateJobSeekerExperience);

module.exports = Router;

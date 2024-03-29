const express = require("express");

const Router = express.Router();

const messageController = require("../controllers/message");

Router.post("/", messageController.sendHireInvitation);
Router.get(
  "/history/jobseeker/:idJobseeker",
  messageController.getAllMessageJobseeker
);

module.exports = Router;

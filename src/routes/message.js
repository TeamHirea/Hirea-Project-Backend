const express = require("express");

const Router = express.Router();

const messageController = require("../controllers/message");

Router.post("/", messageController.sendHireInvitation);

module.exports = Router;

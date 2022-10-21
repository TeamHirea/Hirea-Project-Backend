const express = require("express");

const Router = express.Router();
const authRouter = require("./auth");

const portfolioRouter = require("./portfolio");

const userRouter = require("./user");
const experienceRouter = require("./experience");
const messageRouter = require("./message");
const skillRouter = require("./skill");

Router.get("/ping", (request, response) => {
  response.status(200).send("Hello World!");
});

Router.use("/auth", authRouter);
Router.use("/portfolio", portfolioRouter);

// user's endpoint
Router.use("/user", userRouter);

// experience's endpoint
Router.use("/experience", experienceRouter);

// message's endpoint
Router.use("/message", messageRouter);

// skill's endpoint
Router.use("/skill", skillRouter);
module.exports = Router;

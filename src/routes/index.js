const express = require("express");

const Router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const experienceRouter = require("./experience");

Router.get("/ping", (request, response) => {
  response.status(200).send("Hello World!");
});

Router.use("/auth", authRouter);

// user's endpoint
Router.use("/user", userRouter);

// experience's endpoint
Router.use("/experience", experienceRouter);
module.exports = Router;

const express = require("express");

const Router = express.Router();
const authRouter = require("./auth");
const portfolioRouter = require("./portfolio");

Router.get("/ping", (request, response) => {
  response.status(200).send("Hello World!");
});

Router.use("/auth", authRouter);
Router.use("/portfolio", portfolioRouter);

module.exports = Router;

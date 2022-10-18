const express = require("express");

const Router = express.Router();
const authRouter = require("./auth");

Router.get("/ping", (request, response) => {
  response.status(200).send("Hello World!");
});

Router.use("/auth", authRouter);

module.exports = Router;

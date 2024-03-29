const express = require("express");
const uploadMiddleware = require("../middlewares/uploadFile");

const portfolioController = require("../controllers/portfolio");
// const authMiddleware = require("../middlewares/auth");

const Router = express.Router();

Router.post(
  "/create",
  uploadMiddleware.uploadImagePortfolio,
  portfolioController.createPortfolio
);

Router.patch(
  "/update/:id",
  uploadMiddleware.uploadImagePortfolio,
  portfolioController.updatePortfolio
);
Router.get("/:idJobseeker", portfolioController.getPortfolioByIdJobseeker);
Router.delete("/delete/:id", portfolioController.deletePortfolio);

module.exports = Router;

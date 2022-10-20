// const jwt = require("jsonwebtoken");
const wrapper = require("../utils/responseHandler");
// const client = require("../config/redis");
const User = require("../models/user");

module.exports = {
  isActive: async (req, res, next) => {
    try {
      const findUserActive = await userModel.getDataById(req.user.userId);
      if (findUserActive.data[0].statusUser === "active") {
        next();
      } else {
        return wrapper.response(
          res,
          401,
          "You must verify your acount first!",
          null
        );
      }
    } catch (error) {
      console.log(error);
    }
  },
};

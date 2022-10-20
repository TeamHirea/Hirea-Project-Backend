// const jwt = require("jsonwebtoken");
const wrapper = require("../utils/responseHandler");
// const client = require("../config/redis");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;
      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      token = token.split(" ")[1];

      const checkTokenBlackList = await client.get(`accessToken:${token}`);

      if (checkTokenBlackList) {
        return wrapper.response(
          response,
          403,
          "Your token blacklist already, you already log out!",
          null
        );
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          return wrapper.response(response, 403, err.message, null);
        }
        request.user = decoded;
        return next();
      });
    } catch (error) {
      console.log(error);
    }
  },

  
};

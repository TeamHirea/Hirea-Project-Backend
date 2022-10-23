// const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const wrapper = require("../utils/responseHandler");
const client = require("../config/redis");
// const userModel = require("../models/user");

module.exports = {
  // eslint-disable-next-line consistent-return
  authentication: async (request, response, next) => {
    try {
      const bearertoken = request.headers.authorization;
      if (!bearertoken) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      const token = bearertoken.split(" ")[1];

      const checkTokenBlackList = await client.client.get(
        `accessToken:${token}`
      );

      if (checkTokenBlackList) {
        return wrapper.response(
          response,
          403,
          "Your token blacklist already, you already log out!",
          null
        );
      }

      return jwt.verify(
        token,
        process.env.JWT_PRIVATE_ACCESS_KEY,
        (err, decoded) => {
          if (err) {
            return wrapper.response(response, 403, err.message, null);
          }
          request.user = decoded;
          return next();
        }
      );
      // eslint-disable-next-line no-empty
    } catch (error) {}
  },
};

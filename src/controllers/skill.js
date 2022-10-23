const skillModel = require("../models/skill");
const wrapper = require("../utils/responseHandler");

module.exports = {
  getJobSeekerSkill: async (request, response) => {
    try {
      const { id_jobseeker: id } = request.params;

      const result = await skillModel.getJobSeekerSkill(id);

      if (result.data[0].skill === null) {
        return wrapper.response(
          response,
          404,
          "This user has no skill provided",
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success getting user skill(s)",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;

      return wrapper.response(response, status, statusText, errorData);
    }
  },
  updateJobSeekerSkill: async (request, response) => {
    try {
      const { id_jobseeker: id } = request.params;
      const { skill } = request.body;

      const result = await skillModel.updateJobSeekerSkill(id, skill);

      return wrapper.response(
        response,
        result.status,
        "Success updating skill",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;

      return wrapper.response(response, status, statusText, errorData);
    }
  },
};

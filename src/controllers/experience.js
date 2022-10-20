const experienceModel = require("../models/experience");
const wrapper = require("../utils/responseHandler");

module.exports = {
  updateJobSeekerExperience: async (request, response) => {
    try {
      const { id: experienceId } = request.params;
      const { title, company, detail } = request.body;
      let { start_date: startDate, end_date: endDate } = request.body;

      if (startDate) {
        startDate = new Date(startDate).toLocaleString();
      }

      if (endDate) {
        endDate = new Date(endDate).toLocaleString();
      }

      // const setData = { title, company, detail, start_date, end_date };

      // const result = await experienceModel.updateJobSeekerExperience(
      //   experienceId,
      //   title,
      //   company,
      //   detail,
      //   startDate,
      //   endDate
      // );
      await experienceModel.updateJobSeekerExperience(
        experienceId,
        title,
        company,
        detail,
        startDate,
        endDate
      );

      return wrapper.response(response, 200, "Success update experience", []);
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

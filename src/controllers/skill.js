const skillModel = require("../models/skill");
const userModel = require("../models/user");
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
      const { skill, skill_id: skillId } = request.body;

      const skillNoWS = skill.replace(/^\s+/g, "");
      const isEmptyString = skillNoWS.trim().length === 0;

      if (isEmptyString) {
        return wrapper.response(
          response,
          400,
          "Skill name should not be empty",
          []
        );
      }

      const result = await skillModel.updateJobSeekerSkill(
        id,
        skillId,
        skillNoWS
      );

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
  addJobSeekerSkill: async (request, response) => {
    try {
      const { id_jobseeker: id } = request.params;
      let { skill } = request.body;

      skill = skill.replace(/^\s+/g, "");

      const isEmptySkill = skill.trim().length === 0;

      if (isEmptySkill) {
        return wrapper.response(
          response,
          400,
          "Skill name should not be empty",
          []
        );
      }

      const checkSkill = await skillModel.getJobSeekerSkill(id);
      const userSkills = checkSkill.data[0].skills.map((item) =>
        item.skill_name.toLowerCase()
      );

      const isExists = userSkills.includes(skill.toLowerCase());

      if (isExists) {
        return wrapper.response(response, 400, "Skill already exists", []);
      }

      const result = await skillModel.addJobSeekerSkill(id, skill);

      return wrapper.response(
        response,
        result.status,
        "Success adding skill",
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
  deleteJobSeekerSkill: async (request, response) => {
    try {
      const { id_jobseeker: id } = request.params;
      const { skill_id: skillId } = request.body;

      const checkUser = await userModel.getJobSeekersById(id);

      if (checkUser.data.length < 1) {
        return wrapper.response(
          response,
          404,
          "Jobseeker with given id doesn't exist",
          []
        );
      }

      if (!skillId) {
        return wrapper.response(
          response,
          404,
          "Skill id shouldn't be empty",
          []
        );
      }

      const checkSkillId = await skillModel.getJobSeekerSkillById(skillId);

      if (checkSkillId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          "Skill with given id doesn't exist",
          []
        );
      }

      const result = await skillModel.deleteJobSeekerSkill(id, skillId);

      return wrapper.response(response, 204, "Event DELETED!", result.data);
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

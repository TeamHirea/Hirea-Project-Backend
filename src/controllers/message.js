const messageModel = require("../models/message");
const userModel = require("../models/user");
const { sendEmail } = require("../utils/hireInvitationMail");
const wrapper = require("../utils/responseHandler");

module.exports = {
  sendHireInvitation: async (request, response) => {
    console.log("test1");
    try {
      const { idJobseeker, idRecruiter, subject, message } = request.body;
      const setData = {
        idJobseeker,
        idRecruiter,
        subject,
        message,
      };

      // get data jobseeker by id
      const checkJobseeker = await userModel.getJobSeekersById(idJobseeker);
      // get data recruiter by id
      const checkRecruiter = await userModel.getRecruiterById(idRecruiter);
      //   save data by model
      await messageModel.sendInvitation(setData);
      console.log("test2");

      //   mailing
      const setMailOptions = {
        jobseekerEmail: "setyawandwiki1@gmail.com",
        recruiterEmail: checkRecruiter.data[0].email,
        jobseekerName: checkJobseeker.data[0].name,
        company: checkRecruiter.data[0].company,
        message,
        recruiterName: checkRecruiter.data[0].name,
        subject,
        template: "sendHireInvitation.html",
      };

      await sendEmail(setMailOptions);
      return wrapper.response(
        response,
        200,
        "Success Send Invitation Email",
        null
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getAllMessageJobseeker: async (req, res) => {
    const { idJobseeker } = req.body;
    try {
      const getAllMessage = await messageModel.getAllMessagesJobseeker(
        idJobseeker
      );
      return wrapper.response(
        res,
        getAllMessage.status,
        "success get all message to jobseeker",
        getAllMessage.data
      );
    } catch (error) {
      console.log(error);
    }
  },
  // sendMessageRecruiter: async (req, res) => {
  //   try {
  //     const getAllMessage = await messageModel.getAllMessagesJobseeker();
  //     console.log("test");
  //     return wrapper.response(
  //       res,
  //       getAllMessage.status,
  //       "success get data ",
  //       getAllMessage.data
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};

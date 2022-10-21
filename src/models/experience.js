/* eslint-disable camelcase */
const supabase = require("../config/supabase");

module.exports = {
  updateJobSeekerExperience: (id, title, company, detail, startDate, endDate) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .update({
          title,
          company,
          detail,
          start_date: startDate,
          end_date: endDate,
        })
        .eq("id", id)
        .select()
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createJobSeekerExperience: (
    title,
    company,
    start_date,
    end_date,
    detail,
    id_jobseeker
  ) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .insert([
          {
            title,
            company,
            start_date,
            end_date,
            detail,
            id_jobseeker,
          },
        ])
        // .eq("public.jobseeker.id", id_jobseeker)
        .select()
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getJobSeekerExperienceById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .select()
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteExperience: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("experience")
        .delete()
        .eq("id", id)
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

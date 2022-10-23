const supabase = require("../config/supabase");

module.exports = {
  getJobSeekerSkill: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .select("skill")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateJobSeekerSkill: (id, skill) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .update({ skill })
        .eq("id", id)
        .select("skill")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

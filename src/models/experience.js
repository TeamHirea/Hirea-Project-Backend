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

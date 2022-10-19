const supabase = require("../config/supabase");

module.exports = {
  createRecruiter: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("recruiter")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  createJobSeeker: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateUser: (userId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("recruiter")
        .update(data)
        .eq("id", userId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

const supabase = require("../config/supabase");

module.exports = {
  createRecruiter: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("recruiter")
        .insert([data])
        .then((result) => {
          console.log(result);
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

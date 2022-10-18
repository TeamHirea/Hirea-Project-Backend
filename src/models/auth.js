const supabase = require("../config/supabase");

module.exports = {
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      supabase
        .from("recruiter")
        .select("*")
        .eq("email", email)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

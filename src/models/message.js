const supabase = require("../config/supabase");

module.exports = {
  sendInvitation: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("message")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

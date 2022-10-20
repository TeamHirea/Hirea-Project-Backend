const supabase = require("../config/supabase");

module.exports = {
  createPortfolio: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portfolio")
        .insert([data])
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getPortfolioByTitle: (title) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portfolio")
        .select("*")
        .eq("title", title)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getPortfolioById: (id) =>
    new Promise((resolve, reject) => {
      // SELECT * FROM product WHERE id = "123"
      supabase
        .from("portfolio")
        .select("*")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updatePortfolio: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("portfolio")
        .update([data])
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

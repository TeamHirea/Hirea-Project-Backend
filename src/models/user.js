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
  updateRecruiter: (userId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("recruiter")
        .update(data)
        .eq("id", userId)
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateJobseeker: (userId, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .update(data)
        .eq("id", userId)
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  // need some fixes
  getAllJobSeekers: (objParams) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .select("*")
        // .ilike("skill", `%${objParams.countingParams.search}%`)
        .order(objParams.column, { ascending: objParams.order }) // sorting the results based on column and order type entered
        .range(objParams.offset, objParams.offset + objParams.limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  // still not working properly
  getCountJobSeekers: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .select("*", { count: "exact" })
        // .ilike("skill", `${searchKeyword.search}`)
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getJobSeekersById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
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
};

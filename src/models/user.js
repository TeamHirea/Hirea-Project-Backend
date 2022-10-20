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
  getAllJobSeekers: (objParams) =>
    new Promise((resolve, reject) => {
      let query = supabase
        .from("jobseeker")
        .select("*")
        .ilike("skill", `%${objParams.countingParams.search}%`)
        .order(objParams.column, { ascending: objParams.order }) // sorting the results based on column and order type entered
        .range(objParams.offset, objParams.offset + objParams.limit - 1);

      if (Object.hasOwn(objParams.countingParams, "previousDay")) {
        query = query
          .gt("dateTimeShow", objParams.countingParams.previousDay)
          .lt("dateTimeShow", objParams.countingParams.nextDay);
      }

      query.then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    }),
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

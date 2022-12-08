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
  getRecruiterById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("recruiter")
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
  getAllJobSeekers: (objParams) =>
    new Promise((resolve, reject) => {
      const query = supabase.from("jobseeker").select("*");

      // if (objParams.search.length > 0) {
      //   query = query.contains("skills_backup", objParams.search);
      // }

      query
        .order(objParams.column, { ascending: objParams.order })
        .range(objParams.offset, objParams.offset + objParams.limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),

  getSearchSkill: (search) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skills")
        .select("*")
        // .ilike("skill_name", `%${search}%`)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCountJobSeekers: (dataArr) =>
    new Promise((resolve, reject) => {
      let query = supabase.from("jobseeker").select("*", { count: "exact" });

      if (dataArr.length > 0) {
        query = query.contains("skills_backup", dataArr);
      }

      query.then((result) => {
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

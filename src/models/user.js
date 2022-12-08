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
      if (objParams.search.length < 1) {
        objParams.search.push("");
      }
      const query = supabase
        .from("jobseeker")
        .select("name, skills(skill_name, skill_id)");

      query
        .ilike("skills.skill_name", `%${objParams.search[0]}%`)
        // .range(objParams.offset, objParams.offset + objParams.limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });

      // supabase
      //   .from("jobseeker")
      //   .select("id, name, skills(skill_id, skill_name)")
      //   .ilike("skills.skill_name", "%Java%")
      //   .then((result) => {
      //     if (!result.error) {
      //       resolve(result);
      //     } else {
      //       reject(result);
      //     }
      //   });
    }),
  getCountJobSeekers: (dataArr) =>
    new Promise((resolve, reject) => {
      const query = supabase
        .from("jobseeker")
        .select("*, skills(*)", { count: "exact" });

      // if (dataArr.length > 0) {
      //   query = query.contains("skill", dataArr);
      // }

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

const supabase = require("../config/supabase");
const db = require("../config/postgre");

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
  pgGetAllJobSeekers: (objParams) =>
    new Promise((resolve, reject) => {
      let sqlQuery = `select j.id from jobseeker j inner join skills s on s.id_jobseeker = j.id where s.skill_name ilike '%' || $1 ||'%'`;
      const sqlValue = [objParams.search];

      if (objParams.filter) {
        if (objParams.filter.toLowerCase() === "freelance") {
          sqlQuery += " and j.job_type = $2";
          sqlValue.push(objParams.filter);
        }

        if (objParams.filter.toLowerCase() === "fulltime") {
          sqlQuery += " and j.job_type = $2";
          sqlValue.push(objParams.filter);
        }
      }

      sqlQuery += ` group by j.id order by lower(j.name) asc LIMIT $${
        sqlValue.length + 1
      } OFFSET $${sqlValue.length + 2}`;

      sqlValue.push(objParams.limit);
      sqlValue.push(objParams.offset);

      db.query(sqlQuery, sqlValue)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  // getAllJobSeekers: (objParams) =>
  //   new Promise((resolve, reject) => {
  //     console.log(objParams);
  //     // if (objParams.search.length < 1) {
  //     //   objParams.search.push("");
  //     // }
  //     // console.log(objParams.search);
  //     const query = supabase
  //       .from("jobseeker")
  //       .select("id, name, skills(skill_name, skill_id)", { count: "exact" });

  //     query
  //       .ilike("skills.skill_name", `%${objParams.search}%`)
  //       .not("skills.skill_name", "is", null)
  //       // .order("name", { ascending: objParams.order })
  //       .range(objParams.offset, objParams.offset + objParams.limit - 1)
  //       .then((result) => {
  //         if (!result.error) {
  //           resolve(result);
  //         } else {
  //           reject(result);
  //         }
  //       });
  //   }),
  getCountJobSeekers: (objParams) =>
    new Promise((resolve, reject) => {
      let sqlQuery = `select j.id from jobseeker j inner join skills s on s.id_jobseeker = j.id where s.skill_name ilike '%' || $1 ||'%'`;
      const sqlValue = [objParams.search];

      if (objParams.filter) {
        if (objParams.filter.toLowerCase() === "freelance") {
          sqlQuery += " and j.job_type = $2";
          sqlValue.push(objParams.filter);
        }

        if (objParams.filter.toLowerCase() === "fulltime") {
          sqlQuery += " and j.job_type = $2";
          sqlValue.push(objParams.filter);
        }
      }

      sqlQuery += " group by j.id";

      db.query(sqlQuery, sqlValue)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  searchJobSeekersById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .select("*, skills(skill_name, skill_id)")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
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

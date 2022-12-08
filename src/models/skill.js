const supabase = require("../config/supabase");

module.exports = {
  getJobSeekerSkill: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("jobseeker")
        .select("name, skills(skill_name, skill_id)")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  updateJobSeekerSkill: (id, skillId, skillName) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skills")
        .update({ skill_name: skillName, updated_at: new Date().toJSON() })
        .match({ skill_id: skillId, id_jobseeker: id })
        .select()
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  addJobSeekerSkill: (id, skillName) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skills")
        .insert([{ skill_name: skillName, id_jobseeker: id }], { upsert: true })
        .select()
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  deleteJobSeekerSkill: (id, skillId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skills")
        .delete()
        .eq("skill_id", skillId)
        .select()
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getJobSeekerSkillById: (skillId) =>
    new Promise((resolve, reject) => {
      supabase
        .from("skills")
        .select("*")
        .eq("skill_id", skillId)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};

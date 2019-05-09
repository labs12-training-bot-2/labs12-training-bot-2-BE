const db = require("../index");

module.exports = {
  add,
  find,
  update,
  remove
};

function find(filters) {
  return db("team_members AS tm")
    .select(
      "tm.id",
      "tm.user_id",
      "tm.first_name",
      "tm.last_name",
      "tm.job_description",
      "tm.email",
      "tm.phone_number",
      "tm.slack_uuid",
      "tm.manager_id",
      "man.first_name AS manager_name",
      "tm.mentor_id",
      "men.first_name AS mentor_name"
    )
    .join("users AS u", { "tm.user_id": "u.id" })
    .leftOuterJoin("team_members AS man", { "tm.manager_id": "man.id" })
    .leftOuterJoin("team_members AS men", { "tm.mentor_id": "men.id" })
    .where(filters);
}

function add(member) {
  return db("team_members")
    .insert(member, ["*"])
    .then(tm => find({ "tm.id": tm[0].id }).first());
}

async function update(id, member) {
  return db("team_members")
    .where({
      id
    })
    .update(member);
}

function remove(id) {
  return db("team_members")
    .where({
      id
    })
    .del();
}

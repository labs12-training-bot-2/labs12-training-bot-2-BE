const db = require("../index.js");

module.exports = {
  add,
  find,
  remove
};

function find(filters) {
  return db("responses AS r")
    .select(
      "r.id AS id",
      "tm.id AS team_member_id",
      "tm.first_name",
      "tm.last_name",
      "r.body AS response",
      "s.name AS service",
      "r.created_at"
    )
    .join("notifications as n", { "r.notification_id": "n.id" })
    .join("services as s", { "n.service_id": "s.id" })
    .join("team_members as tm", { "n.team_member_id": "tm.id" })
    .where(filters);
}

function add(response) {
  return db("responses")
    .insert(response, ["*"])
    .then(r => find({ "r.id": r[0].id }).first());
}

function remove(id) {
  return db("responses")
    .where({ id })
    .del();
}

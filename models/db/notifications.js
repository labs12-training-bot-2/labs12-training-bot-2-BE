const db = require("../index");

module.exports = {
  add,
  find,
  remove,
  update
};

function find(filters) {
  return db("notifications AS n")
    .select(
      "n.id",
      "n.send_date",
      "n.is_sent",
      "n.num_attempts",
      "n.thread",
      "n.message_id",
      "ts.id AS training_series_id",
      "ts.title AS series",
      "tm.id AS team_member_id",
      "tm.first_name",
      "tm.last_name",
      "tm.email",
      "tm.phone_number",
      "tm.slack_uuid",
      "m.subject",
      "m.body",
      "m.link",
      "u.email AS user",
      "s.name"
    )
    .leftJoin("messages AS m", { "m.id": "n.message_id" })
    .leftJoin("services AS s", { "s.id": "n.service_id" })
    .leftJoin("team_members AS tm", { "tm.id": "n.team_member_id" })
    .leftJoin("users AS u", { "u.id": "tm.user_id" })
    .leftJoin("training_series AS ts", { "ts.id": "m.training_series_id" })
    .where(filters)
    .orderBy("n.send_date");
}

function add(notification) {
  return db("notifications")
    .insert(notification, ["*"])
    .then(n => find({ "n.id": n[0].id }).first());
}

function update(filter, changes) {
  return db("notifications AS n")
    .update(changes, ["*"])
    .where(filter);
}

function remove(filters) {
  return db("notifications AS n")
    .leftJoin("team_members AS tm", { "tm.id": "n.team_member_id" })
    .leftJoin("users AS u", { "u.id": "tm.user_id" })
    .where(filters)
    .del();
}

const db = require("../index");

module.exports = {
  add,
  find,
  remove
};

function add(notification) {
  return db("notifications")
    .insert(notification, ["*"])
    .then(n => find({ "n.id": n[0].id }).first());
}

function find(filters) {
  return db("notifications AS n")
    .select(
      "n.id",
      "n.send_date",
      "n.is_sent",
      "n.num_attempts",
      "n.thread",
      "ts.title AS series",
      "m.subject",
      "m.body",
      "m.link",
      "s.name",
      "tm.phone_number",
      "tm.email",
      "tm.slack_uuid",
      "u.email AS admin"
    )
    .leftJoin("messages AS m", { "m.id": "n.message_id" })
    .leftJoin("services AS s", { "s.id": "n.service_id" })
    .leftJoin("team_members AS tm", { "tm.id": "n.team_member_id" })
    .leftJoin("users AS u", { "u.id": "tm.user_id" })
    .leftJoin("training_series AS ts", { "ts.id": "m.training_series_id" })
    .where(filters)
    .orderBy("n.send_date");
}

function update(filter, changes) {
  return db('notifications AS n')
    .update(changes, ['*'])
    .where(filter)
}

function remove(filters) {
  return db("notifications AS n")
    .leftJoin("team_members AS tm", { "tm.id": "n.team_member_id" })
    .leftJoin("users AS u", { "u.id": "tm.user_id" })
    .where(filters)
    .del();
}

const db = require("../index");

module.exports = {
  add,
  find,
  update,
  remove
};

function add(message) {
  return db("messages")
    .insert(message, ["*"])
    .then(m => find({ "m.id": m[0].id }).first());
}

function find(filters) {
  return db("messages AS m")
    .select(
      "m.id",
      "m.subject",
      "m.body",
      "m.link",
      "m.for_manager",
      "m.for_mentor",
      "ts.title AS series"
    )
    .leftJoin("training_series AS ts", { "ts.id": "m.training_series_id" })
    .leftJoin("users AS u", { "u.id": "ts.user_id" })
    .where(filters)
    .orderBy("series");
}

function update(filter, message) {
  return db("messages AS m")
    .update(message, ["*"])
    .where(filter)
    .then(m => find({ "m.id": m[0].id }).first());
}

function remove(filter) {
  return db("messages AS m")
    .where(filter)
    .del();
}

const db = require("../index");

module.exports = {
  add,
  find,
  update,
  remove
};

function find(filters) {
  return db("training_series AS ts")
    .select("ts.id", "ts.title", "u.email AS user")
    .join("users AS u", { "ts.user_id": "u.id" })
    .where(filters);
}

function add(series) {
  return db("training_series")
    .insert(series, ["*"])
    .then(ts => find({ "ts.id": ts[0].id }).first());
}

function update(filters, changes) {
  return db("training_series AS ts")
    .update(changes, ["*"])
    .where(filters)
    .then(ts => find({ "ts.id": ts[0].id }).first());
}

function remove(filters) {
  return db("training_series AS ts")
    .where(filters)
    .del();
}

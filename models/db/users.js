const db = require("../index.js");

module.exports = {
  add,
  find,
  update,
  remove
};

function find(filters) {
  if (filters) {
    return db("users AS u")
      .select(
        "u.id AS id",
        "u.name AS name",
        "u.email AS email",
        "u.stripe AS stripe",
        "u.notifications_sent",
        "a.title AS subscription",
        "a.max_notification_count"
      )
      .join("account_types AS a", { "u.account_type_id": "a.id" })
      .where(filters);
  }
  return db("users AS u")
    .select(
      "u.id AS id",
      "u.name AS name",
      "u.email AS email",
      "u.stripe AS stripe",
      "u.notifications_sent",
      "a.account_type AS subscription",
      "a.max_notification_count"
    )
    .join("account_types AS a", { "u.account_type_id": "a.id" });
}

function add(user) {
  return db("users")
    .insert(user, ["*"])
    .then(u => find({ "u.id": u[0].id }).first());
}

function update(filter, changes) {
  return db("users")
    .update(changes, ["*"])
    .where(filter)
    .then(u => find({ "u.id": u[0].id }).first());
}

function remove(filter) {
  return db("users")
    .where(filter)
    .del();
}

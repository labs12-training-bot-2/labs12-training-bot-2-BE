//Sample user-model

const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByEmail,
  findTrainingSeriesByUser,
  getUserAccountType,
  getUserMessages,
  updateUser,
  deleteUser
};

function find() {
  return db("users");
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

function add(user) {
  return db("users")
    .insert(user)
    .returning("*");
}

function findByEmail(email) {
  return db("users")
    .where("email", email)
    .first();
}

function findTrainingSeriesByUser(id) {
  return db("users")
    .select("t.id", "t.title")
    .join("training_series AS t", "users.id", "t.user_id")
    .where("users.id", id);
}

function getUserAccountType(id) {
  return db("account_types AS a")
    .select(
      "a.account_type as subscription",
      "a.max_notification_count",
      "u.notification_count"
    )
    .join("users AS u", "u.account_type_id", "a.id")
    .where("u.id", id)
    .first();
}

function getUserMessages(id) {
  return db("users AS u")
    .select("m.*")
    .leftJoin("training_series AS t", "u.id", "t.user_id")
    .leftJoin("messages AS m", "t.id", "m.training_series_id")
    .where("u.id", id)
    .orderBy("m.training_series_id");
}

function updateUser(id, changes) {
  return db("users")
    .where("id", id)
    .update(changes)
    .returning("*");
}

function deleteUser(id) {
  return db("users")
    .where({ id })
    .del();
}

//Sample user-model

const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findByEmail,
  findTrainingSeriesByUser,
  getUserAccountType,
  getUserPosts,
  updateUser,
  deleteUser
};

function find() {
  return db("users").returning("*");
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .returning("*")
    .first();
}

function add(user) {
  return db("users")
    .insert(user)
    .returning("*")
    .first();
}

function findByEmail(email) {
  return db("users")
    .where("email", email)
    .returning("*")
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

function getUserPosts(id) {
  return db("users AS u")
    .select("messages.*")
    .join("training_series AS t", "u.id", "t.user_id")
    .join("messages AS m", "t.id", "m.training_series_id")
    .where("u.id", id)
    .groupBy("m.training_series_id");
}

function updateUser(id, changes) {
  return db("users")
    .where("id", id)
    .update(changes)
    .returning("*");
}

function deleteUser(id) {
  return db("users")
    .where("id", id)
    .del();
}

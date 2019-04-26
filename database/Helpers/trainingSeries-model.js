const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  getAllPosts,
  getTrainingSeriesPosts,
  update,
  remove,
  getMembersAssigned
};

function find() {
  return db("training_series").returning("*");
}

function findBy(filter) {
  return db("training_series")
    .where(filter)
    .returning("*")
    .first();
}

function add(training_series) {
  return db("training_series")
    .insert(training_series)
    .returning("*");
}

// not a production function
function getAllPosts() {
  return db("messages").returning("*");
}

function getTrainingSeriesPosts(id) {
  return db("messages")
    .where({ training_series_id: id })
    .returning("*");
}

function update(id, series) {
  return db("training_series")
    .where({ id })
    .update(series)
    .returning("*");
}

function remove(id) {
  return db("training_series")
    .where({ id })
    .del();
}

function getMembersAssigned(id) {
  return db("relational_table as r")
    .join("team_members as t", "t.id", "r.team_member_id")
    .select("r.team_member_id", "r.start_date", "t.first_name", "t.last_name")
    .where("r.training_series_id", id);
}

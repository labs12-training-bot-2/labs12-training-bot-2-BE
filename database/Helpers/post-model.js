const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  update,
  remove
};

function find() {
  return db("messages");
}

function findBy(filter) {
  return db("messages")
    .where(filter)
    .first();
}

function findById(id) {
  return db("messages").where({ id });
}

function add(message) {
  return db("messages")
    .insert(message, "id")
    .returning("*");
}

function update(id, message) {
  return db("messages")
    .where({ id })
    .update(member);
}

function remove(id) {
  return db("messages")
    .where({ id })
    .del();
}

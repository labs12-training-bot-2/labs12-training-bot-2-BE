const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  update,
  remove
};

function find() {
  return db("messages").returning("*");
}

function findBy(filter) {
  return db("messages")
    .where(filter)
    .returning("*")
    .first();
}

function add(message) {
  return db("messages")
    .insert(message, "id")
    .returning("*");
}

function update(id, message) {
  return db("messages")
    .where({ id })
    .update(member)
    .returning("*");
}

function remove(id) {
  return db("messages")
    .where({ id })
    .del();
}

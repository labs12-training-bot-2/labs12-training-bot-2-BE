const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db("TeamMember");
}

function findBy(filter) {
  return db("TeamMember").where(filter);
}

async function add(user) {
  const [id] = await db("TeamMember").insert(user);

  return findById(id);
}

function findById(id) {
  return db("TeamMember")
    .where({ id })
    .first();
}

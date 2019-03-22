const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  addPostSeeds
};

function find() {
  return db("Post");
}

function findBy(filter) {
  return db("Post").where(filter);
}

async function add(post) {
  const [id] = await db("Post").insert(post, "id");

  return findById(id);
}

function findById(id) {
  return db("Post")
    .where({ id })
    .first();
}

function addPostSeeds(posts) {
  return db("Post").insert(posts);
}

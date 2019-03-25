const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  addPostSeeds,
  update,
  remove
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
    .where({ postID: id })
    .first();
}

function addPostSeeds(posts) {
  return db("Post").insert(posts);
}


async function update(id, post) {
  await db("Post")
    .where({ postID: id })
    .update(post);

  return await findById(id);
}

function remove(id) {
  return db("Post")
    .where({ postID: id })
    .del();
}


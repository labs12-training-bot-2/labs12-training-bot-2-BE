const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  addTrainingSeriesSeeds,
  getAllPosts
};

function find() {
  return db("TrainingSeries");
}

function findBy(filter) {
  return db("TrainingSeries").where(filter);
}

async function add(trainingSeries) {
  const [id] = await db("TrainingSeries").insert(trainingSeries);

  return findById(id);
}

function findById(id) {
  return db("TrainingSeries")
    .where({ id })
    .first();
}

function addTrainingSeriesSeeds(seeds) {
  return db("TrainingSeries").insert(seeds);
}

function getAllPosts() {
  return db("Post");
}

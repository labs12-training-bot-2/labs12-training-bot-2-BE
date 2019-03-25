const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  addTrainingSeriesSeeds,
  getAllPosts,
  getTrainingSeriesPosts,
  update
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

async function update(id, series) {
  await db("TrainingSeries")
    .where({ trainingSeriesID: id })
    .update(series);

  return await findById(id);
}

function findById(id) {
  return db("TrainingSeries")
    .where({ trainingSeriesID: id })
    .first();
}

function addTrainingSeriesSeeds(seeds) {
  return db("TrainingSeries").insert(seeds);
}

// not a production function
function getAllPosts() {
  return db("Post");
}

function getTrainingSeriesPosts(id) {
  return db("Post").where({ trainingSeriesID: id}).first();
}

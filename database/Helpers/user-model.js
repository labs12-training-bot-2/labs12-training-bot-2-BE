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
  getUserPosts
};

function find() {
  return db("User");
}

function findBy(filter) {
  return db("User").where(filter);
}

async function add(user) {
  const [id] = await db("User").insert(user);

  return findById(id);
}

function findById(id) {
  return db("User")
    .select("email", "userID")
    .where("User.userID", id)
    .first();
}

function findByEmail(email) {
  return db("User")
    .where("email", email)
    .first();
}

function findTrainingSeriesByUser(id) {
  return db("User")
    .select(
      "TrainingSeries.trainingSeriesID",
      "TrainingSeries.TrainingSeries",
      "TrainingSeries.title"
    )
    .join("TrainingSeries", "User.userID", "TrainingSeries.userID")
    .where("User.userID", id);
}

function getUserAccountType(id) {
  return db("accountType")
    .select(
      "accountType.accountType as subscription",
      "accountType.maxNotificationCount"
    )
    .join("User", "User.accountTypeID", "accountType.accountTypeID")
    .where("User.userID", id)
    .first();
}

function getUserPosts(id) {
  return db("User")
    .select("Post.*")
    .join("TrainingSeries", "User.userID", "TrainingSeries.userID")
    .join("Post", "TrainingSeries.trainingSeriesID", "Post.trainingSeriesID")
    .where("User.userID", id)
    .groupBy("Post.trainingSeriesID");
}

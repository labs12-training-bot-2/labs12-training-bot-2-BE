const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  update,
  remove,
  addToTrainingSeries,
  getTrainingSeriesAssignments,
  getTrainingSeriesAssignment,
  updateTrainingSeriesStartDate,
  findTrainingSeriesBy,
  removeFromTrainingSeries,
  addToNotificationsTable
};

function find() {
  return db("team_members").returning("*");
}

function findBy(filter) {
  return db("team_members")
    .where(filter)
    .returning("*")
    .first();
}

function add(member) {
  return db("team_members")
    .insert(member)
    .returning("*");
}

async function update(id, member) {
  return db("team_members")
    .where({ id })
    .update(member)
    .returning("*");
}

function remove(id) {
  return db("team_members")
    .where({ id })
    .del();
}

//assign team member to a training series
async function addToTrainingSeries(assignment) {
  const [id] = await db("relational_table")
    .insert(assignment)
    .returning("id");

  return db("relationalTable")
    .where({ id })
    .first()
    .returning("*");
}

//get a team member's training series assignments
function getTrainingSeriesAssignments(id) {
  return db("team_members")
    .join("relational_table AS r", "team_members.t", "r.team_members_id")
    .join("training_series", "training_series.id", "r.training_series_id")
    .select("r.training_series_id", "training_series.title", "r.start_date")
    .where("r.team_members_id", id);
}

// get member information for updating notification send date
function getTrainingSeriesAssignment(team_membersId, trainingSeriesId) {
  return db("team_members")
    .join("relational_table AS r", "team_members.id", "r.team_members_id")
    .join("training_series AS t", "t.id", "r.training_series_id")
    .select("r.training_series_id", "t.title", "r.start_date")
    .where({
      "r.team_members_id": team_membersId,
      "r.training_series_id": trainingSeriesId
    })
    .first();
}

//update the start date ONLY of a team member's training series start date
async function updateTrainingSeriesStartDate(
  team_members_id,
  training_series_id,
  updatedStartDate
) {
  await db("relational_table")
    .where({
      team_members_id,
      training_series_id
    })
    .update({ start_date: updatedStartDate });

  return findTrainingSeriesBy({
    team_members_id,
    training_series_id
  });
}

/*
find training series using a filter

if you want to find a single training series assigned to the user, you should use two keys:
trainingSeries_ID and team_members_ID.

if you want to find all of the team member's assigned training series, only one key is needed:
team_members_ID
*/
function findTrainingSeriesBy(filter) {
  return db("relational_table")
    .where(filter)
    .returning("*");
}

async function removeFromTrainingSeries(team_members_id, training_series_id) {
  const deleted = await db("relational_table")
    .where({
      team_members_id,
      training_series_id
    })
    .returning("*")
    .del();

  await db("notifications")
    .where({
      team_members_id,
      training_series_id
    })
    .del();

  return deleted;
}

function addToNotificationsTable(data) {
  return db("notifications").insert(data);
}

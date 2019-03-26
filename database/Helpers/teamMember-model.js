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
  updateTrainingSeriesStartDate,
  findTrainingSeriesBy,
  removeFromTrainingSeries
};

function find() {
  return db("TeamMember");
}

function findBy(filter) {
  return db("TeamMember").where(filter);
}

async function add(member) {
  const [id] = await db("TeamMember").insert(member);

  return findById(id);
}

function findById(id) {
  return db("TeamMember")
    .where({ teamMemberID: id })
    .first();
}

async function update(id, member) {
  await db("TeamMember")
    .where({ teamMemberID: id })
    .update(member);

  return await findById(id);
}

function remove(id) {
  return db("TeamMember")
    .where({ teamMemberID: id })
    .del();
}

//assign team member to a training series
async function addToTrainingSeries(assignment) {
  const [id] = await db("RelationalTable").insert(assignment);

  return db("RelationalTable")
    .where({ relationalTableID: id })
    .first();
}

//get a team member's training series assignments
function getTrainingSeriesAssignments(teamMemberId) {
  return db("TeamMember")
    .join(
      "RelationalTable",
      "TeamMember.teamMemberID",
      "RelationalTable.teamMember_ID"
    )
    .join(
      "TrainingSeries",
      "TrainingSeries.trainingSeriesID",
      "RelationalTable.trainingSeries_ID"
    )
    .select(
      "RelationalTable.trainingSeries_ID",
      "TrainingSeries.title",
      "RelationalTable.startDate"
    )
    .where("RelationalTable.teamMember_ID", teamMemberId);
}

//update the start date ONLY of a team member's training series start date
async function updateTrainingSeriesStartDate(
  teamMemberId,
  trainingSeriesId,
  updatedStartDate
) {
  await db("RelationalTable")
    .where({ teamMember_ID: teamMemberId, trainingSeries_ID: trainingSeriesId })
    .update({ startDate: updatedStartDate });

  return findTrainingSeriesBy({
    teamMember_ID: teamMemberId,
    trainingSeries_ID: trainingSeriesId
  });
}

/*
find training series using a filter

if you want to find a single training series assigned to the user, you should use two keys:
trainingSeries_ID and teamMember_ID.

if you want to find all of the team member's assigned training series, only one key is needed:
teamMember_ID
*/
function findTrainingSeriesBy(filter) {
  return db("RelationalTable").where(filter);
}

function removeFromTrainingSeries(teamMemberId, trainingSeriesId) {
  return db("RelationalTable")
    .where({ teamMember_ID: teamMemberId, trainingSeries_ID: trainingSeriesId })
    .del();
}

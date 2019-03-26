const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  update,
  remove,
  addToTrainingSeries,
  getTrainingSeriesAssignments
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

  return db("RelationalTable").where({ relationalTableID: id}).first();
}

function getTrainingSeriesAssignments(teamMemberId) {
  return db("TeamMember")
    .join(
      "RelationalTable",
      "TeamMember.teamMemberID",
      "RelationalTable.teamMember_ID"
    )
    .join("TrainingSeries", "TrainingSeries.trainingSeriesID", "RelationalTable.trainingSeries_ID")
    .select("RelationalTable.trainingSeries_ID",
    "TrainingSeries.title", "RelationalTable.startDate")
    .where("RelationalTable.teamMember_ID", teamMemberId);
}

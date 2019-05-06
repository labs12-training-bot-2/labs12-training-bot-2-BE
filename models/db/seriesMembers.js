/** 
 * THIS FILE IS UNDER CONSTRUCTION
 * 
 * All database calls made to the relational_table
 * have been placed in this file and are not being exported
 * this will be resolved as soon as I figure out what the FE
 * engineers are expecting.
 */
function getMembersAssigned(id) {
  return db("relational_table as rt")
    .select(
      "rt.team_member_id", 
      "rt.start_date", 
      "tm.first_name", 
      "tm.last_name")
    .join("team_members as tm", {"tm.id": "rt.team_member_id"})
    .where("rt.training_series_id", id);
}

//assign team member to a training series
async function addToTrainingSeries(assignment) {
  const [id] = await db("relational_table")
    .insert(assignment)
    .returning("id");

  return db("relationalTable")
    .where({
      id
    })
    .first();
}

//get a team member's training series assignments
function getTrainingSeriesAssignments(id) {
  return db("relational_table AS rt")
    .select(
      "rt.training_series_id",
      "rt.team_member_id",
      "ts.title",
      "rt.start_date"
    )
    .join("team_members AS tm", { "tm.id": "rt.team_member_id" })
    .join("training_series AS ts", { "ts.id": "rt.training_series_id" })
    .where({ "rt.team_member_id": id });
}

// get member information for updating notification send date
function getTrainingSeriesAssignment(team_membersId, trainingSeriesId) {
  return db("team_members AS t")
    .leftOuterJoin("relational_table AS r", "t.id", "r.team_member_id")
    .leftOuterJoin("training_series AS ts", "ts.id", "r.training_series_id")
    .select("r.training_series_id", "ts.title", "r.start_date")
    .where({
      "r.team_member_id": team_membersId,
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
    .update({
      start_date: updatedStartDate
    });

  return findTrainingSeriesBy({
    team_members_id,
    training_series_id
  });
}

async function removeFromTrainingSeries(team_member_id, training_series_id) {
  const deleted = await db("relational_table")
    .where({
      team_member_id,
      training_series_id
    })
    .del();
  await db("notifications")
    .where({
      team_member_id,
      training_series_id
    })
    .del();

  return deleted;
}
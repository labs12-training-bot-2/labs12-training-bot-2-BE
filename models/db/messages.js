const db = require("../index");

module.exports = {
  add,
  find,
  update,
  remove
};

/**
 * Adds a new Message to the database, and then returns the newly created
 * message
 *
 * @function
 * @param  {Object} message - A Message object
 * @returns {Promise} Promise that resolves to the new message Object
 */
function add(message) {
  return db("messages")
    .insert(message, ["*"])
    .then(m => find({ "m.id": m[0].id }).first());
}

function find(filters) {
  return db("messages AS m")
    .select(
      "m.id",
      "m.subject",
      "m.body",
      "m.link",
      "m.for_manager",
      "m.for_mentor",
      "m.for_team_member",
      "ts.title AS series",
      "m.training_series_id",
      "m.days_from_start"
    )
    .leftJoin("training_series AS ts", { "ts.id": "m.training_series_id" })
    .leftJoin("users AS u", { "u.id": "ts.user_id" })
    .where(filters)
    .orderBy("series");
}

function update(filter, message) {
  return db("messages AS m")
    .update(message, ["*"])
    .where(filter)
    .then(m => find({ "m.id": m[0].id }).first());
}

async function remove(filter) {
  const msg = await db("messages AS m")
    .leftJoin("training_series AS ts", { "ts.id": "m.training_series_id" })
    .leftJoin("users AS u", { "u.id": "ts.user_id" })
    .where(filter)
    .delete();

  console.log(msg);
}

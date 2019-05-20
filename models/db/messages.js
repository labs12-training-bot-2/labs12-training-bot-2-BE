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

/**
 * Finds a particular message or set of messages based on the contents of a
 * filters object
 *
 * @param  {Object} filters - A filter object to be passed to the "where" clause
 * @returns {Promise} Promise that resolves to an array of found Message objects
 */
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

/**
 * Updates a record or set of records based on the key/value pairs in the
 * filter object
 *
 * @param  {Object} filter - A filter object to be passed to the "where" clause
 * @param  {Object} message - An object containing the changes you'd like to make to the message(s) selected by the filter object
 * @returns {Promise}
 */
function update(filter, message) {
  return db("messages AS m")
    .update(message, ["*"])
    .where(filter)
    .then(m => find({ "m.id": m[0].id }).first());
}

/**
 * Deletes a single Message or set of Messages based on the key/value pairs
 * contained within the filter object.
 *
 * @param  {Object} filter - A filter object to be passed to the "where" clause
 * @returns {Promise} A Promise that resolves to the number of records deleted
 */
function remove(filter) {
  return db("messages AS m")
    .leftJoin("training_series AS ts", { "ts.id": "m.training_series_id" })
    .leftJoin("users AS u", { "u.id": "ts.user_id" })
    .where(filter)
    .delete();
}

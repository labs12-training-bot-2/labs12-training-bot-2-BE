const db = require("../index.js");

module.exports = {
  add,
  find,
  remove
};

/**
 * Adds a new Response to the database, and then returns the newly created
 * Response
 *
 * @function
 * @param  {Object} message - A Response object
 * @returns {Promise} Promise that resolves to the new Response object
 */
function add(response) {
  return db("responses")
    .insert(response, ["*"])
    .then(r => find({ "r.id": r[0].id }).first());
}

/**
 * Finds a particular Response or set of Responses based on the key/value pairs
 * contained within the filter object parameter.
 *
 * @param  {Object} filters - A filter object to be passed to the "where" clause
 * @returns {Promise} Promise that resolves to an array of found Response objects
 */
function find(filters) {
  return db("responses AS r")
    .select(
      "r.id AS id",
      "tm.id AS team_member_id",
      "tm.first_name",
      "tm.last_name",
      "r.body AS response",
      "s.name AS service",
      "r.created_at",
      "n.thread"
    )
    .join("notifications as n", { "r.notification_id": "n.id" })
    .join("services as s", { "n.service_id": "s.id" })
    .join("team_members as tm", { "n.team_member_id": "tm.id" })
    .where(filters);
}

/**
 * Deletes a single Response or set of Responses based on the key/value
 * pairs contained within the filter object parameter.
 *
 * @param  {Object} filter - A filter object to be passed to the "where" clause
 * @returns {Promise} A Promise that resolves to the number of Responses deleted
 */
function remove(id) {
  return db("responses")
    .where({ id })
    .del();
}

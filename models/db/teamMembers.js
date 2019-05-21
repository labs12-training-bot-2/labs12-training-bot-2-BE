const db = require("../index");

module.exports = {
  add,
  find,
  update,
  remove
};

/**
 * Find a Team Member or set of Team Members in the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} - A Promise that resolves to an array of Team Member objects
 */
function find(filters) {
  return db("team_members AS tm")
    .select(
      "tm.id",
      "tm.user_id",
      "tm.first_name",
      "tm.last_name",
      "tm.job_description",
      "tm.email",
      "tm.phone_number",
      "tm.slack_uuid",
      "tm.manager_id",
      "man.first_name AS manager_name",
      "tm.mentor_id",
      "men.first_name AS mentor_name"
    )
    .join("users AS u", { "tm.user_id": "u.id" })
    .leftOuterJoin("team_members AS man", { "tm.manager_id": "man.id" })
    .leftOuterJoin("team_members AS men", { "tm.mentor_id": "men.id" })
    .where(filters);
}

/**
 * Add a Team Member to the Database
 *
 * @function
 *
 * @param {Object} teamMember - A Team Member object
 * @see https://knexjs.org/#Builder-insert
 *
 * @returns {Promise} - A Promise that resolves to the newly created Team Member
 */
function add(teamMember) {
  return db("team_members")
    .insert(teamMember, ["*"])
    .then(tm => find({ "tm.id": tm[0].id }).first());
}

/**
 * Update a Team Member to the Database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @param {Object} changes - An object representing the keys to update and their values
 * @see https://knexjs.org/#Builder-update
 *
 * @returns {Promise} - A Promise that resolves to the updated Team Member(s)
 */
function update(filters, changes) {
  return db("team_members AS tm")
    .update(changes, ["*"])
    .where(filters)
    .then(tm => find({ "tm.id": tm[0].id }).first());
}

/**
 * Deletes a specific Team Member or set of Team Members from the database
 *
 * @function
 *
 * @param {Object} filters - A filters object to pass to the SQL WHERE clause
 * @see https://knexjs.org/#Builder-where
 *
 * @returns {Promise} A promise that resolves to the number of Team Member(s) deleted
 */
function remove(filters) {
  return db("team_members AS tm")
    .where(filters)
    .del();
}

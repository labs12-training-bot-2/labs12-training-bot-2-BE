const db = require("../index.js");

module.exports = {
  find,
  add,
  update,
  remove
};

/**
 * Finds a token based on the filter provided and returns
 * an object
 *
 * @param {Object} filters
 */

function find(filters) {
  return db("tokens AS tk")
    .select(
      "tk.id",
      "tk.expiration",
      "tk.auth_token",
      "tk.refresh_token",
      "s.name AS service",
      "u.email AS user"
    )
    .join("users AS u", { "tk.user_id": "u.id" })
    .join("services AS s", { "tk.service_id": "s.id" })
    .where(filters);
}

/**
 * Creates a new Token in the database associated with a service and a user
 *
 * @function
 * @param {Object} filters A filter object to be passed to the "where" clause (destructured in this case)
 * @param {Integer} filters.user_id - A user's ID
 * @param {String} filters.service - A services's name (e.g slack, twilio, sendgrid)
 * @param {String} filters.auth_token - An OAuth token
 * @param {String} [filters.refresh_token] - (optional) An OAuth Refresh Token
 * @param {DateTime} [filters.expiration] - (optional) An expiration datetime for the OAuth Token
 * @returns {Promise} a promise which resolves to the newly created Token
 */

async function add({
  user_id,
  service,
  auth_token,
  refresh_token,
  expiration
}) {
  const { id } = await db("services AS s")
    .select("s.id")
    .where({ name: service })
    .first();

  return db("tokens")
    .insert(
      {
        auth_token,
        refresh_token,
        expiration,
        service_id: id,
        user_id
      },
      ["*"]
    )
    .then(tk => find({ "tk.id": tk[0].id }).first());
}

/**
 * Updates a token row, such as after a token expires and
 * a new one is retrieved.  Returns a promise that when resolved
 * will return an object with the updated properties.
 *
 * @function
 * @param {Integer} id
 * @param {Object} changes
 * @returns {Promise}
 */

function update(id, changes) {
  return db("token")
    .update(changes, ["*"])
    .where({ id })
    .then(tk => find({ "tk.id": tk[0].id }).first());
}

/**
 * When given an id for a token, the corresponding row
 * on the table will be removed
 *
 * @function
 * @param {Integer} id
 * @returns {Promise}
 */

function remove(id) {
  return db("token")
    .where({ id })
    .del();
}

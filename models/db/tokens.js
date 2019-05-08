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
 * Provided with user_id, service, and auth_token--with the option for
 * refersh_token and expiration--creates a new row in the
 * 'token' database then returns a promise which returns
 * the newly created object with ID when resolved.
 *
 * @param {Integer} user_id
 * @param {String} service
 * @param {String} auth_token
 * @param {String} refresh_token
 * @param {String} expiration
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
 * @param {Integer} id
 * @param {Object} changes
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
 * @param {Integer} id
 */

function remove(id) {
  return db("token")
    .where({ id })
    .del();
}

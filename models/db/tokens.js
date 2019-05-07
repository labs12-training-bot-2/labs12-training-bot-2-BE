const db = require("../index.js");

module.exports = {
  add,
  find,
  update,
  remove,
};

function add(token) {
  return db("tokens")
    .update(token, ["*"])
    .then(t => find({ 't.id': t[0].id }).first());
}

function find(filters) {
  return db('tokens AS t')
    .select(
      't.auth_token',
      't.refresh_token',
      't.expiration',
      's.name AS service',
      'u.email AS user'
    )
    .join('services AS s', {'t.service_id': 's.id'})
    .join('users AS u', {'t.user_id': 'u.id'})
    .where(filters)
}

function update(filters, changes) {
  return db('tokens')
    .insert(token, ['*'])
    .where(filters)
    .then(t => find({ 't.id': t[0].id} ))
}

function remove(filters) {
  return db('tokens')
    .where(filters)
    .del()
}

const db = require("../index.js");

module.exports = {
  add,
  find,
  update,
  remove
};

function add(message) {
  return db("messages")
    .insert(message, ['*'])
    .then(m => find({ 'm.id': m[0].id }).first())
}

function find(filters) {
  return db('messages AS m')
    .select(
      'm.id',
      'm.message_name',
      'm.message_details',
      'm.link',
      'm.days_from_start',
      'ts.title AS series'
    )
    .leftJoin('training_series AS ts', { 'ts.id': 'm.training_series_id' })
    .leftJoin('users AS u', { 'u.id': 'ts.user_id' })
    .where(filters)
    .orderBy('series')
}

function update(id, message) {
  return db("messages")
    .update(message, ['*'])
    .where({ id })
    .then(m => find({ 'm.id': m[0].id }).first())
}

function remove(id) {
  return db("messages")
    .where({ id })
    .del();
}

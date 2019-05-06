const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  update,
  remove,
};

function find(filters) {
  if (filters) {
    return db('training_series AS ts')
      .select(
        'ts.id',
        'ts.title',
        'u.email AS user'
      )
      .join('users AS u', { 'ts.user_id': 'u.id' })
      .where(filters)
  }
  return db("training_series AS ts")
    .select(
      'ts.id',
      'ts.title',
      'u.email AS user'
    )
    .join('users AS u', { 'ts.user_id': 'u.id' })
}

function add(series) {
  return db("training_series")
    .insert(series, ['*'])
    .then(ts => find({ 'ts.id': ts[0].id }).first());
}

function update(id, changes) {
  return db("training_series")
    .update(changes, ["*"])
    .where({ id })
    .then(ts => find({ 'ts.id': ts[0].id }).first())
}

function remove(id) {
  return db("training_series")
    .where({ id })
    .del();
}

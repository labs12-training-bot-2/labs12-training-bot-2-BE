const db = require("../index.js");

module.exports = {
  add,
  find,
  remove,
}
/**
 * Takes a new response object and adds it to the database.
 * 
 * Returns a Promise which resolves to the newly created response object, 
 * including its ID.
 * 
 * @param  {Object} response
 */
function add(response) {
  return db('responses')
    .insert(response, ['*'])
}

/**
 * Returns a Promise which, when resolved, contains either an array of 
 * responses based on the thread they're apart of or an individual response 
 * based on its ID (which is a UUID). 
 * 
 * You should only provide the argument for the item(s) you want returned, 
 * setting the other to null or _
 * 
 * @param  {String} responding_to
 * @param  {String} id
 */
function find(responding_to, id) {
  if (!responding_to && !id) { 
    throw Error('You must specify either a response ID or a thread ID')
  }

  if (responding_to) {
    return db('responses').where({ responding_to });
  }

  return db('responses').where({ id }).first();
}
/**
 * Takes a response's ID (which is a UUID) and deletes it from the database,
 * returns a Promise that resolves with the number of records deleted (if any). 
 * 
 * @param  {String} id
 */
function remove(id) {
  return db('responses')
    .where({ id })
    .del()
}
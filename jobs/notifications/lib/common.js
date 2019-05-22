const db = require("../../../models");

module.exports = {
  batchUpdate,
  asyncMap
};

/**
 * Takes a table and an array of resource objects and updates the database in a
 * single transaction. Will rollback the transaction if any update on the
 * database fails.
 *
 * @param {String} table - The table name you'd like to batch updates to
 * @param {Array} arr - An array of resource objects
 * @see https://knexjs.org/#Builder-transacting
 * 
 * @return {Promise} A Knex.js Transaction promise that resolves to the number of records affected by the transaction
 */
function batchUpdate(table, arr) {
  return db.transaction(trx => {
    // Map over the array passed in to create an array of pending Promise queries to transact
    const queries = arr.map(i =>
      db(table)
        .where("id", i.id)
        .update(i)
        .transacting(trx)
    );
    
    // Attempt to resolve all Pending promises in the queries array, and commit 
    // the updates to the database if all resolve as they should. Rollback the 
    // transaction if any fail
    return Promise.all(queries)
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

/**
 * Takes an array of resource objects and maps over them, calling a callback function on each object in the array
 * 
 * @param {Array} arr - An array of resource objects 
 * @param {function} cb - A callback function
 * @return {Array} - An array of modified resource objects
 */
async function asyncMap(arr, cb) {
  // Map over the array that was passed in, calling the callback function on 
  // each item (i) in the array. Will return an array of Promises.
  const pArray = arr.map(async i => {
    const promise = await cb(i);

    return promise;
  });

  // Resolve all Promises in the array created by the map function above
  const data = await Promise.all(pArray);

  // Return the array of resolved promises
  return data;
}

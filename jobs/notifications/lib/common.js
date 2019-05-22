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

async function asyncMap(arr, cb) {
  const pArray = arr.map(async i => {
    const promise = await cb(i);

    return promise;
  });

  const data = await Promise.all(pArray);

  return data;
}

const db = require("../../../models");

module.exports = {
  batchUpdate,
  asyncMap
};

function batchUpdate(table, arr) {
  console.log("initial values", table, arr);
  return db.transaction(trx => {
    const queries = arr.map(i =>
      db(table)
        .where("id", i.id)
        .update(i)
        .transacting(trx)
    );

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

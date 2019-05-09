const db = require('../../../models');

module.exports = {
  batchUpdate
};

function batchUpdate(table, arr) {
  return db.transaction(trx => {
    const queries = arr.map(item =>
      db(table)
        .where("id", item.id)
        .update(item)
        .transacting(trx)
    );
    return Promise.all(queries)
      .then(trx.commit)
      .catch(trx.rollback);
  });
}
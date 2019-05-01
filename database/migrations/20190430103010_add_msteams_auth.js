
exports.up = function(knex, Promise) {
  return knex.schema.table('users', tbl => {
    tbl.text('ms_auth_token')
    tbl.text('ms_refresh_token')
    tbl.datetime('ms_token_expiration')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', tbl => {
    tbl.dropColumn('ms_auth_token')
    tbl.dropColumn('ms_refresh_token')
    tbl.dropColumn('ms_token_expiration')
  })
};

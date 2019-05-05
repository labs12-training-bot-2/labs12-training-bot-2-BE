
exports.up = function(knex, Promise) {
  return knex.schema.table('team_members', tbl => {
    tbl.integer('manager')
       .references('id')
       .inTable('team_members')
       .onDelete('CASCADE')
       .onUpdate('CASCADE')
    tbl.integer('mentor')
       .references('id')
       .inTable('team_members')
       .onDelete('CASCADE')
       .onUpdate('CASCADE')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('team_members', tbl => {
    tbl.dropColumn('manager')
    tbl.dropColumn('mentor')
  })
};

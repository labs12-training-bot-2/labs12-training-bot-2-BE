exports.up = function(knex, Promise) {
  return knex.schema.table("messages", tbl => {
    tbl
      .boolean("for_team_member")
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("messages", tbl => {
    tbl.dropColumn("for_team_member");
  });
};

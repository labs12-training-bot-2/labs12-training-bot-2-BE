exports.up = function(knex, Promise) {
  return knex.schema.table("notifications", tbl => {
    tbl
      .boolean("for_team_member")
      .notNullable()
      .defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("notifications", tbl => {
    tbl.dropColumn("for_team_member");
  });
};

exports.up = function(knex, Promise) {
  return knex.schema
    .table("team_members", tbl => {
      tbl.boolean("slack_on");
    })
    .table("notifications", tbl => {
      tbl.boolean("slack_sent");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table("team_members", tbl => {
      tbl.dropColumn("slack_on");
    })
    .table("notifications", tbl => {
      tbl.dropColumn("slack_sent");
    });
};

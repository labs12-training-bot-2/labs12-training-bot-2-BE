exports.up = function(knex, Promise) {
  return knex.schema.table("notifications", tbl => {
    tbl.integer("recipient_id").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("notifications", tbl => {
    tbl.dropColumn("recipient_id");
  });
};

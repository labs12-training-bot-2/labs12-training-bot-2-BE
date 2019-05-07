exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("account_types", tbl => {
      tbl.increments();
      tbl.text("title").notNullable();
      tbl.integer("max_notification_count").notNullable();
    })
    .createTable("users", tbl => {
      tbl.increments();
      tbl.text("name").notNullable();
      tbl.text("email").notNullable();
      tbl.text("stripe");
      tbl
        .integer("notifications_sent")
        .notNullable()
        .defaultTo(0);
      tbl
        .integer("account_type_id")
        .references("id")
        .inTable("account_types")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable()
        .defaultTo(1);
    })
    .createTable("services", tbl => {
      tbl.increments();
      tbl.text("name").notNullable();
    })
    .createTable("tokens", tbl => {
      tbl.increments();
      tbl.datetime("expiration");
      tbl.text("auth_token").notNullable();
      tbl.text("refresh_token");
      tbl
        .integer("service_id")
        .references("id")
        .inTable("services")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      tbl
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
    })
    .createTable("team_members", tbl => {
      tbl.increments();
      tbl.text("first_name").notNullable();
      tbl.text("last_name").notNullable();
      tbl.text("job_description");
      tbl.text("email");
      tbl.text("phone_number");
      tbl.text("slack_uuid");
      tbl
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      tbl
        .integer("manager_id")
        .references("id")
        .inTable("team_members")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("mentor_id")
        .references("id")
        .inTable("team_members")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("training_series", tbl => {
      tbl.increments();
      tbl.text("title").notNullable();
      tbl
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
    })
    .createTable("messages", tbl => {
      tbl.increments();
      tbl.text("subject").notNullable();
      tbl.text("body").notNullable();
      tbl.text("link");
      tbl
        .integer("training_series_id")
        .references("id")
        .inTable("training_series")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      tbl
        .boolean("for_manager")
        .notNullable()
        .defaultTo(false);
      tbl
        .boolean("for_mentor")
        .notNullable()
        .defaultTo(false);
    })
    .createTable("notifications", tbl => {
      tbl.increments();
      tbl.datetime("send_date").notNullable();
      tbl
        .boolean("is_sent")
        .notNullable()
        .defaultTo(false);
      tbl
        .integer("num_attempts")
        .notNullable()
        .defaultTo(0);
      tbl.text("thread");
      tbl
        .integer("message_id")
        .references("id")
        .inTable("messages")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      tbl
        .integer("service_id")
        .references("id")
        .inTable("services")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      tbl
        .integer("team_member_id")
        .references("id")
        .inTable("team_members")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
    })
    .createTable("responses", tbl => {
      tbl.increments();
      tbl.text("body");
      tbl
        .integer("notification_id")
        .references("id")
        .inTable("notifications")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      tbl
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists("responses")
    .dropTableIfExists("notifications")
    .dropTableIfExists("messages")
    .dropTableIfExists("training_series")
    .dropTableIfExists("team_members")
    .dropTableIfExists("tokens")
    .dropTableIfExists("services")
    .dropTableIfExists("users")
    .dropTableIfExists("account_types");
};
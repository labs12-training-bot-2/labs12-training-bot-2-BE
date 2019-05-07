exports.seed = function(knex, Promise) {
  return knex("services").then(function() {
    return knex("services").insert([
      { name: "twilio" },
      { name: "sendgrid" },
      { name: "slack" }
    ]);
  });
};

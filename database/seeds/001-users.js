exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("table_name")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("table_name").insert([
        { authToken: 3, accountTypeID: 1 },
        { authToken: 4, accountTypeID: 1 },
        { authToken: 5, accountTypeID: 1 }
      ]);
    });
};

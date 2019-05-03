exports.up = function(knex, Promise) {
  // Enable PostgreSQL's built in UUID extension
  knex.raw('create extension if not exists "uuid_ossp"')

	return knex.schema
		.table('messages', tbl => {
			tbl.text('message_id').unique();
		})
		.createTable('responses', tbl => {
			tbl.uuid('id')
				.primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'))
			tbl.text('response_text').notNullable();
			tbl.text('response_method').notNullable();
			tbl.text('responding_to')
				.references('message_id')
				.inTable('messages')
				.onDelete('CASCADE')
				.onUpdate('CASCADE')
				.notNullable();
		});
};

exports.down = function(knex, Promise) {
  // Drop the enabled UUID extension
  knex.raw('drop extension if exists "uuid-ossp"')

	return knex.schema
    .dropTableIfExists('responses')
    .table('messages', tbl => {
			tbl.dropColumn('twilio_id');
		})
};

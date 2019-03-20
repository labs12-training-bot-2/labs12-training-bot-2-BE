require('dotenv').config();

module.exports = {
	development: {
		client: 'mysql',
		connection: {
			host: process.env.DATABASE_URL_DEV,
			user: process.env.DATABASE_USER_DEV,
			port: process.env.DATABASE_PORT_DEV,
			password: process.env.DATABASE_PASSWORD_DEV,
			database: process.env.DATABASE_NAME_DEV,
		},
		pool: {
			min: 2,
			max: 10,
		},

		seeds: {
			directory: './database/seeds',
		},
	},
	production: {
		client: 'mysql',
		connection: {
			host: process.env.DATABASE_URL,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
		},
		pool: {
			min: 2,
			max: 10,
		},
	},
};

require("dotenv").config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.DB_LOCAL,
      user: process.env.DB_LOCAL_USER,
      password: process.env.DB_LOCAL_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./database/migrations/"
    },
    seeds: {
      directory: "./database/seeds/"
    },
    useNullAsDefault: true
  },
  production: {
    client: "postgresql",
    connection: process.env.HEROKU_POSTGRESQL_MAUVE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./database/migrations/"
    },
    seeds: {
      directory: "./database/seeds/"
    },
    useNullAsDefault: true
  }
};

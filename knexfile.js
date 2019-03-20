require("dotenv").config();

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DATABASE_URL,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: "mysql",
    connection: {
      host: process.env.DATABASE_URL,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};

require('dotenv').config();

const knex = require('knex');
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
console.log(`Deploying ${environment} build.`);

module.exports = knex(knexConfig[environment]);

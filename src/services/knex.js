const knex = require('knex');
const config = require('../config');
const environment = config.app.environment;
const environmentConfig = config[environment];
const connection = knex(environmentConfig);

module.exports = connection;
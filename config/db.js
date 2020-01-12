const config = require('../knexfile.js')
const knex = require('knex')(config)

//Executa as migrations assim que inicia o sistema
knex.migrate.latest([config])


module.exports = knex
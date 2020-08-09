import '../utils/dotenv'
import knex from 'knex'
const configDatabase = require('../../knexfile')

const enviroment = process.env.NODE_ENV || 'development'

const db = knex(configDatabase[enviroment])

export default db

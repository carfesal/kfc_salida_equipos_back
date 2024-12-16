require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME ?? 'localhost',
    password: process.env.DB_PASSWORD ?? 1234,
    database: process.env.DB_NAME ?? 'database_development',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 5432,
    dialect: process.env.DB_DIALECT ?? 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
}
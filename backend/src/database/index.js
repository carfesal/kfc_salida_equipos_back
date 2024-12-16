const Sequelize = require('sequelize');
const dbConfig = require('../config/database')[process.env.APP_ENV || 'development'];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
});

sequelize.authenticate()
    .then(() => {
        console.log('ion has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;
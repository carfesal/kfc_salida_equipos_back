const sequelize  = require('../database');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const basename = path.basename(__filename);
const models = {};

// fs.readdirSync(__dirname)
//     .filter(file => {
//         return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
//     }).forEach(file => {
//         const model = require(path.join(__dirname, file))(sequelize, sequelize.Sequelize.DataTypes);
//         models[model.name] = model;
//     });

// Object.keys(models).forEach(modelName => {
//     if (models[modelName].associate) {
//         models[modelName].associate(models);
//     }
// });
models.Usuario = require('./usuario');
models.Rol = require('./rol');
models.Permiso = require('./permiso');
models.Adjunto = require('./adjunto');
models.Salida = require('./salida');
models.SalidaDetalle = require('./salidadetalle');
models.Lugar = require('./lugar');
models.Equipo = require('./equipo');

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;


module.exports = models;
const sequelize  = require('../database');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const basename = path.basename(__filename);
const models = {};

// LEER TODOS LOS MODELOS
models.Usuario = require('./usuario');
models.Rol = require('./rol');
models.Permiso = require('./permiso');
models.Adjunto = require('./adjunto');
models.Salida = require('./salida');
models.SalidaDetalle = require('./salidadetalle');
models.Lugar = require('./lugar');
models.Equipo = require('./equipo');

// ASOCIAR LOS MODELOS ENTRE SI
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const sequelize = require('../database');

class Lugar extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Lugar.hasMany(models.SalidaDetalle, {
      foreignKey: 'destinoId',
      as: 'salidas'
    })
  }
}
Lugar.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Lugar',
  tableName: 'Lugar',
  freezeTableName: true
});

module.exports = Lugar;

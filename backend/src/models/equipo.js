'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const sequelize = require('../database');

class Equipo extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Equipo.init({
  nombre: DataTypes.STRING,
  marca: DataTypes.STRING,
  modelo: DataTypes.STRING,
  serie: DataTypes.STRING,
  descripcion: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Equipo',
  tableName: 'Equipo',
  freezeTableName: true
});

module.exports = Equipo;

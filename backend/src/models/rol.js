'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../database');

class Rol extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Rol.belongsToMany(models.Permiso, {
      through: 'RolPermiso',
      as: 'permisos',
      foreignKey: 'rolId',
    });
    Rol.hasMany(models.Usuario, {
      foreignKey: 'rolId',
      as: 'usuarios'
    });
  }
}
Rol.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Rol',
  tableName: 'Rol',
  freezeTableName: true
});

module.exports = Rol;

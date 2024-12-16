'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../database');

class Permiso extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    Permiso.belongsToMany(models.Rol, {
      through: 'RolPermiso',
      as: 'roles',
      foreignKey: 'permisoId',
    });
  }
}
Permiso.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Permiso',
  tableName: 'Permiso',
  freezeTableName: true
}); 

module.exports = Permiso;

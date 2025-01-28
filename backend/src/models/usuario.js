'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../database');
  
class Usuario extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Usuario.belongsTo(models.Rol, {
      foreignKey: 'rolId',
      as: 'rol'
    });
  }

  /**
   * 
   * @param {string} permiso 
   * @returns 
   */
  verificarPermiso(permiso) {
    const rol = this.getRol();
    const permisos = rol.getPermisos();

    return permisos.some(p => p.nombre === permiso);
  }
}
Usuario.init({
  rolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rol',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: DataTypes.STRING,
  activo:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  credencial: {
    type: DataTypes.BLOB,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'Usuario',
  freezeTableName: true
});

module.exports = Usuario;
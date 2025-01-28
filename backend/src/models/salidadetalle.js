'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../database');
const { Salida } = require('.');

class SalidaDetalle extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    SalidaDetalle.belongsTo(models.Salida, {
      foreignKey: 'salidaId',
      as: 'salida'
    });
    SalidaDetalle.belongsTo(models.Equipo, {
      foreignKey: 'equipoId',
      as: 'equipo'
    });
    SalidaDetalle.belongsTo(models.Lugar, {
      foreignKey: 'destinoId',
      as: 'destino'
    });
    SalidaDetalle.hasMany(models.Adjunto, {
      foreignKey: 'salidaDetalleId',
      as: 'adjuntos'
    });
    SalidaDetalle.belongsTo(models.Usuario, {
      foreignKey: 'responsableId',
      as: 'responsable'
    });
  }
}
SalidaDetalle.init({
  salidaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  equipoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  destinoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: DataTypes.INTEGER,
  responsableId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: 
  {
    type: DataTypes.STRING,
    defaultValue: 'PND',
    validate: {
      isIn: [['PND', 'AUT', 'REC']]
    } 
  }
}, {
  sequelize,
  modelName: 'SalidaDetalle',
  tableName: 'SalidaDetalle',
  freezeTableName: true
});

module.exports = SalidaDetalle;
'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const sequelize = require('../database');
  
class Salida extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Salida.belongsTo(models.Usuario, {
      foreignKey: 'responsableId',
      as: 'responsable'
    });
    Salida.belongsTo(models.Usuario, {
      foreignKey: 'autorizadorId',
      as: 'autorizador'
    });
    Salida.hasMany(models.SalidaDetalle, {
      foreignKey: 'salidaId',
      as: 'detalles'
    });
  }
}
Salida.init({
  responsableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'id'
    }
  },
  autorizadorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Usuario',
      key: 'id'
    }
  },
  motivoSalida: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaHoraSalida: DataTypes.DATE,
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
  modelName: 'Salida',
  tableName: 'Salida',
  freezeTableName: true
});

module.exports = Salida;

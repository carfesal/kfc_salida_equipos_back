'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../database');
class Adjunto extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Adjunto.belongsTo(models.SalidaDetalle, {
      foreignKey: 'salidaDetalleId',
      as: 'detalle'
    });
  }
}
Adjunto.init({
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salidaDetalleId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB
  },
  extension: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Adjunto',
  tableName: 'Adjunto',
  freezeTableName: true
});

module.exports = Adjunto;
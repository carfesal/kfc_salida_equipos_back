'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Adjunto', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salidaDetalleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SalidaDetalle',
          key: 'id'
        }
      },
      data: {
        type: Sequelize.BLOB
      },
      extension: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn(process.env.DB_DIALECT == 'mssql' ? 'GETDATE' : 'NOW')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Adjunto');
  }
};
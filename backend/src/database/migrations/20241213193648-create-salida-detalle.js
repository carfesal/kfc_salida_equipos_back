'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SalidaDetalle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      salidaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Salida',
          key: 'id'
        }
      },
      equipoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Equipo',
          key: 'id'
        }
      },
      destinoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lugar',
          key: 'id'
        },
      },
      cantidad: {
        type: Sequelize.INTEGER,
        defaultValue: 1
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
    await queryInterface.dropTable('SalidaDetalle');
  }
};
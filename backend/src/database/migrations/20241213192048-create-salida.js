'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Salida', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      responsableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id'
        }
      },
      autorizadorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuario',
          key: 'id'
        }
      },
      motivoSalida: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fechaHoraSalida: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn(process.env.DB_DIALECT == 'mssql' ? 'GETDATE()' : 'NOW')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Salida');
  }
};
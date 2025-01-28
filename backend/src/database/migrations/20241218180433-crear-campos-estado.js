'use strict';

const dialect = process.env.DB_DIALECT || 'mysql';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    if (dialect === 'mssql'){
      await queryInterface.addColumn('Salida', 'estado', {
        type: Sequelize.STRING(5),
        defaultValue: 'PND',
        allowNull: false
      });
      await queryInterface.addColumn('SalidaDetalle', 'estado', {
        type: Sequelize.STRING(5),
        defaultValue: 'PND',
        allowNull: false
      });

      await queryInterface.sequelize.query(`ALTER TABLE Salida ADD CONSTRAINT chk_Salida_estado CHECK (estado IN ('PND', 'AUT', 'REC'))`);
    } else {
      await queryInterface.addColumn('Salida', 'estado', {
        type: Sequelize.ENUM('PND', 'AUT', 'REC'),
        defaultValue: 'PND',
        allowNull: false
      });
      await queryInterface.addColumn('SalidaDetalle', 'estado', {
        type: Sequelize.ENUM('PND', 'AUT', 'REC'),
        defaultValue: 'PND',
        allowNull: false
      });
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Salida', 'estado');
    await queryInterface.removeColumn('SalidaDetalle', 'estado');
  }
};

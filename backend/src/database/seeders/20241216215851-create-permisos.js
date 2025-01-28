'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let [roles, metadata] = await queryInterface.sequelize.query('SELECT * FROM "Rol" WHERE nombre not in (\'USUARIO\')');

    await queryInterface.bulkInsert('Permiso', [
      {
        nombre: 'AUTORIZAR_SALIDA',
        descripcion: 'Permite autorizar una salida'
      },
      {
        nombre: 'AUTORIZAR_SALIDA_DETALLE',
        descripcion: 'Permite autorizar o denegar un detalle de salida'
      }
    ]);

    let [permisos, metadata_permisos] = await queryInterface.sequelize.query('SELECT * FROM "Permiso"');

    // Insertar permisos a los roles
    for (const permiso of permisos) {
      for (const rol of roles) {
        await queryInterface.bulkInsert('RolPermiso', [
          {
            rolId: rol.id,
            permisoId: permiso.id
          }
        ]);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

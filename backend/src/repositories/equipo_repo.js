const Equipo = require('../models').Equipo;

class EquipoRepository {
    /**
     * 
     * @param {*} datos 
     * @returns 
     */
    static async create(datos) {
        const nuevoEquipo = await Equipo.create(datos);

        if (nuevoEquipo) {
            return nuevoEquipo;
        }

        return null;
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    static async obtenerPorId(id) {
        const equipo = await Equipo.findByPk(id);

        if (equipo) {
            return equipo;
        }

        return null;
    }

    /**
     * 
     * @param {*} id 
     * @param {*} datos 
     * @returns 
     */
    static async actualizarEquipo(id, datos) {
        const equipo = await Equipo.findByPk(id);

        if (equipo) {
            return await equipo.update(datos);
        }

        return null;
    }
}

module.exports = EquipoRepository;
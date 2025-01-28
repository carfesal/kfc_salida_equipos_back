
const Salida = require('../models').Salida;

/**
 * 
 */
class SalidaRepository {
    /**
     * 
     * @param {*} datos 
     * @returns 
     */
    static async crearSalida(datos) {
        const salida = await Salida.create(datos);

        if (salida) {
            return salida;
        }

        return null;
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    static async obtenerSalidaPorId(id, relaciones = []) {
        const salida = await Salida.findOne({
            where: {
                id
            },
            include: relaciones
        })

        if (salida) {
            return salida;
        }

        return null;
    }
    
    /**
     * 
     * @param {*} id 
     * @param {*} datos 
     * @returns 
     */
    static async actualizarSalida(id, datos) {
        const salida = await Salida.findByPk(id);

        if (!salida) return null;

        return await salida.update(datos);
    }

    /**
     * 
     * @param {*} filtros 
     * @returns 
     */
    static async buscarSalidas(filtros, relaciones = []) {
        const salidas = await Salida.findAll({
            where: filtros,
            include: relaciones
        });

        if (salidas) {
            return salidas;
        }

        return [];
    }
}

module.exports = SalidaRepository;
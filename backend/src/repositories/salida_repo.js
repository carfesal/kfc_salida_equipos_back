
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
    static async obtenerSalidaPorId(id) {
        const salida = await Salida.findOne({
            where: {
                id
            },
            include: 'detalles'
        })

        if (salida) {
            return salida;
        }

        return null;
    }
    
}

module.exports = SalidaRepository;
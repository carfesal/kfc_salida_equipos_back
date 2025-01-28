const Adjunto = require('../models/adjunto');

/**
 * 
 */
class AdjuntoRepository {
    /**
     * 
     * @param {*} datos 
     * @returns 
     */
    static async crearAdjunto(datos) {
        const nuevoAdjunto = await Adjunto.create(datos);

        if (nuevoAdjunto) {
            nuevoAdjunto.data = nuevoAdjunto.data.toString('base64');
            return nuevoAdjunto;
        }

        

        return null;
    }
}

module.exports = AdjuntoRepository;
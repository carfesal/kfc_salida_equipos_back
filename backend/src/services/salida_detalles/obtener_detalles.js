const SalidaDetalle = require('../../models/salidadetalle');
const SalidaDetalleRepository = require('../../repositories/salida_detalle_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 * @param {Array<SalidaDetalle>} detalles 
 * @returns 
 */
const parsearAdjuntosDetalles = (detalles) => {
    const detallesParsed = detalles.map(detalle => {
        let detalleParsed = detalle;

        if (detalle.adjuntos && detalle.adjuntos.length > 0) {
            detalleParsed.adjuntos = detalle.adjuntos.map(adjunto => {
                adjunto.data = adjunto.data.toString('base64');
                return adjunto;
            });
        }

        return detalleParsed;
    });

    return detallesParsed;
};

class ObtenerDetalles {
    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos) {
        try {
            let detalles = await SalidaDetalleRepository.
            
            obtenerSalidaDetallesPorSalidaId(datos.salidaId, ['adjuntos']);

            if (!detalles || detalles.length === 0) {                
                return crearRespuesta("No se encontraron detalles de salida", null, 404, false);
            }

            detalles = parsearAdjuntosDetalles(detalles);
            
            return crearRespuesta("Detalles de salida encontrados", detalles, 200, true);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL OBTENER LOS DETALLES DE SALIDA: ", error);
            return crearRespuesta("Ocurrió un error al obtener los detalles de la salida", null, 400, false);
        }
    }
}

module.exports = ObtenerDetalles;
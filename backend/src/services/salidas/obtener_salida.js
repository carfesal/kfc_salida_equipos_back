const SalidaRepository = require('../../repositories/salida_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 */
class ObtenerSalida {
    static async ejecutar(id) {
        try {
            const salida = await SalidaRepository.obtenerSalidaPorId(id);

            if (!salida) {
                return crearRespuesta("No se encontró la salida con id: " + id, null, 404, false);
            }

            return crearRespuesta("Salida encontrada", salida, 200, true);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL OBTENER LA SALIDA: ", error);
            return crearRespuesta("Ocurrió un error al obtener la salida", null, 400, false);
        }
    }
}

module.exports = ObtenerSalida;
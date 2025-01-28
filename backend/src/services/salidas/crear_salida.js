//DEPENDENCIAS
const SalidaRepository = require('../../repositories/salida_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 */
class CrearSalida {
    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos) {
        try {
            if (!datos.responsableId) 
                return crearRespuesta("Se necesita informacion del creador de la salida", null, 400, false);            

            const salidaCreada = await SalidaRepository.crearSalida(datos);

            if (!salidaCreada) {
                return crearRespuesta("Ocurrió un error al crear la salida", null, 400, false);
            }

            return crearRespuesta("Salida creada correctamente", salidaCreada, 201, true);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL CREAR LA SALIDA: ", error);
            throw error;
        }
    }
}

module.exports = CrearSalida;
const SalidaRepository = require('../../repositories/salida_repo');
const UsuarioRepository = require('../../repositories/usuario_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 */
class AutorizarSalida {
    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos) {
        try {
            const salida = await SalidaRepository.obtenerSalidaPorId(datos.id);

            if (!salida) 
                return crearRespuesta("No se encontró la salida con id: " + datos.id, null, 404, false);            

            const usuario = await UsuarioRepository.obtenerUsuarioPorId(datos.usuario_id);

            if (!usuario) 
                return crearRespuesta("No se encontró el usuario con id: " + datos.usuario_id, null, 404, false);
            

            if (!usuario.verificarPermiso('AUTORIZAR_SALIDA')) 
                return crearRespuesta("El usuario no tiene permiso para autorizar salidas", null, 403, false);

            
            

        } catch (error) {
            console.log("Error mientras se autorizaba la salida: ", error);
            return crearRespuesta("Ocurrió un error mientras se autorizaba la salida", null, 500, false);
        }
    };

    /**
     * 
     * @param {number} usuario_id 
     */
    static async verificarPermisoUsuario(usuario_id) {
        
    }
};

module.exports = AutorizarSalida;
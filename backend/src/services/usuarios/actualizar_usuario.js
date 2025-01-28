const UsuarioRepository = require('../../repositories/usuario_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 */
class ActualizarUusario {

    /**
     * 
     * @param {*} datos 
     * @returns 
     */
    async ejecutar(datos) {
        try {
            let { usuarioId, ...datosParaActualizar } = datos;

            const usuario = await UsuarioRepository.obtenerUsuarioPorId(datos.usuarioId);

            if (!usuario) {
                return crearRespuesta("Usuario no encontrado", null, 404, false);
            }

            const usuarioActualizado = await UsuarioRepository.actualizarUsuario(usuarioId, datosParaActualizar);

            if (usuarioActualizado) {
                return crearRespuesta("Usuario actualizado correctamente", null, 200, true);
            }

            return crearRespuesta("No se pudo actualizar el usuario", null, 400, false);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL ACTUALIZAR USUARIO: ", error);
            return crearRespuesta("Ocurrió un error al actualizar el usuario", null, 500, false);
        }
    }
}

module.exports = ActualizarUusario;
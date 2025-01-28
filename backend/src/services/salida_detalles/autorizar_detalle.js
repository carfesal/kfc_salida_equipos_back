const UsuarioRepository = require('../../repositories/usuario_repo');
const SalidaDetalleRepository = require('../../repositories/salida_detalle_repo');
const SalidaRepository = require('../../repositories/salida_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 * @param {*} salidaDetalleId 
 * @param {*} seAutoriza 
 * @returns 
 */
const actualizarAutorizacionDetalle = async (salidaDetalleId, seAutoriza) => {
    const salidaDetalle = await SalidaDetalleRepository.obtenerSalidaDetallePorId(salidaDetalleId);
    const estado = seAutoriza ? 'AUT' : 'REC';

    if (!salidaDetalle) return null;

    return await SalidaDetalleRepository.actualizarSalidaDetalle(salidaDetalleId, { estado });
};

class AutorizarDetalle {
    
    /**
     * 
     * @param {*} datos 
     * @returns 
     */
    static async  ejecutar(datos) {
        try {
            const salida = await SalidaRepository.obtenerSalidaPorId(datos.salidaId);

            if (!salida) 
                return crearRespuesta("No se encontró la salida con id: " + datos.salidaId, null, 404, false);            

            const usuario = await UsuarioRepository.obtenerUsuarioPorId(datos.usuarioId);

            if (!usuario) 
                return crearRespuesta("No se encontró el usuario con id: " + datos.usuarioId, null, 404, false);
            

            if (!usuario.verificarPermiso('AUTORIZAR_SALIDA_DETALLE')) 
                return crearRespuesta("El usuario no tiene permiso para autorizar detalles", null, 403, false);

            const detalleAutorizado = await actualizarAutorizacionDetalle(datos.salidaDetalleId, datos.autorizado);
            
            return detalleAutorizado ? 
                    crearRespuesta("Detalle autorizado correctamente", detalleAutorizado, 200, true) : 
                    crearRespuesta("No se pudo autorizar el detalle", null, 500, false);

        } catch (error) {
            console.error("Error mientras se autorizaba la salida: ", error);
            return crearRespuesta("Ocurrió un error mientras se autorizaba la salida", null, 500, false);
        }
    }    
}

module.exports = AutorizarDetalle;
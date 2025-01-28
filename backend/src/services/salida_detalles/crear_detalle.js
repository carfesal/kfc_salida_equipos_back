const SalidaRepository = require('../../repositories/salida_repo');
const SalidaDetalleRepository = require('../../repositories/salida_detalle_repo');
const CrearEquipo = require('../equipos/crear_equipo');
const LugarRepository = require('../../repositories/lugar_repo');
const { crearRespuesta } = require('../utils');


const buildCrearEquipoRequest = (datos) => {
    return {
        nombre: datos.nombreEquipo,
        descripcion: datos.descripcionEquipo,
        modelo: datos.modeloEquipo,
        serie: datos.serieEquipo,
        marca: datos.marcaEquipo,
    }
};

const buildCrearDetalleData = (destino_id, equipo_id, salida_id, cantidad) => {
    return {
        destinoId: destino_id,
        equipoId: equipo_id,
        salidaId: salida_id,
        cantidad: cantidad
    }
}

/**
 * 
 * @param {*} nombre 
 * @param {*} descripcion 
 * @returns 
 */
const buscarOCrearLugar = async (nombre, direccion) => {
    const lugar = await LugarRepository.obtenerLugarPorNombre(nombre);

    if (!lugar) {
        const nuevoLugar = await LugarRepository.crearLugar(nombre, direccion);

        if (!nuevoLugar) {
            return null;
        }

        return nuevoLugar;
    }

    return lugar;
};

/**
 * 
 */
class CrearDetalleSalida {
    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos) {
        try {
            const salida = await SalidaRepository.obtenerSalidaPorId(datos.salidaId, ['detalles']);
            
            if (!salida) {
                return crearRespuesta("No se encontró la salida", null, 404, false);
            }

            const lugar = await buscarOCrearLugar(datos.nombreDestino, datos.descripcionDestino ?? 'NO ESPECIFICADO');
            
            if (!lugar) 
                return crearRespuesta("No se pudo crear el destino", null, 400, false);

            const equipoResponse = await CrearEquipo.ejecutar(buildCrearEquipoRequest(datos));

            if (!equipoResponse.exito || !equipoResponse.datos) {
                return crearRespuesta("No se pudo crear el equipo", null, 400, false);
            }

            const detalle = await SalidaDetalleRepository.createSalidaDetalle(buildCrearDetalleData(lugar.id, equipoResponse.datos.id, salida.id, datos.cantidad));

            if (!detalle) 
                return crearRespuesta("No se pudo crear el detalle de la salida", null, 400, false);

            return crearRespuesta("Detalle de salida creado correctamente", detalle, 201, true);
        } catch (error) {
            console.log("Error mientras se creaba el detalle de la salida: ", error);
            return crearRespuesta("Ocurrió un error mientras se creaba el detalle de la salida", null, 500, false);
        }
    }
}

module.exports = CrearDetalleSalida;
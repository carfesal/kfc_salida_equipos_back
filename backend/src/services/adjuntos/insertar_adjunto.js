const AdjuntoRepository = require('../../repositories/adjunto_repo');
const SalidaDetalleRepository = require('../../repositories/salida_detalle_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 * @param {string} tipo 
 * @returns 
 */
const verificarTipo = (tipo) => {
    if (tipo.includes('image') || tipo.includes('jpeg') || tipo.includes('png')) {
        return "IMAGEN";
    }else if (tipo.includes('video')) {
        return "VIDEO";
    } else if (tipo.includes('text') || tipo.includes('pdf')) {
        return "DOCUMENTO";
    }

    return "OTRO";
};

const buildCrearAdjuntoData = (detalle_id, data, tipo, extension) => {
    return {
        salidaDetalleId: detalle_id,
        data,
        tipo,
        extension
    };
}

/**
 * 
 */
class InsertarAdjuntos {
    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos) {
        try {
            if (!datos.files || datos.files.length === 0)
                return crearRespuesta("No se han enviado archivos", null, 400, false);
            const detalle = await SalidaDetalleRepository.obtenerSalidaDetallePorId(datos.salidaDetalleId);

            if (!detalle)
                return crearRespuesta("No se encontró el detalle de salida", null, 404, false);
            
            const exitosos = [];
            const fallidos = [];

            for (const adjunto of datos.files) {
                const tipo = verificarTipo(adjunto.mimetype);
                const adjunto_data = buildCrearAdjuntoData(datos.salidaDetalleId, adjunto.data, tipo, adjunto.mimetype);

                const adjuntoInsertado = await AdjuntoRepository.crearAdjunto(adjunto_data);

                if (!adjuntoInsertado) 
                    fallidos.push({nombre: adjunto.nombre, mensaje: "No se pudo insertar el adjunto"});
                else 
                    exitosos.push(adjuntoInsertado);
                    
            }

            return crearRespuesta("Adjuntos insertados", {errores: fallidos, exitosos: exitosos}, 200, true);
        } catch (error) {
            console.error("Ocurrio un error al insertar el adjuntos: ", error);
            return crearRespuesta("Error al insertar adjuntos", null, 500, false);
        }
    }

    /**
     * 
     * @param {*} adjunto_data 
     * @returns 
     */
    static async insertarAdjunto(adjunto_data) {
        try {
            const adjunto = await AdjuntoRepository.crearAdjunto(adjunto_data);

            if (!adjunto) {
                return null
            }

            delete adjunto.data;

            return adjunto;
        } catch (error) {
            console.log("No se pudo insertar el adjunto: ", error);
            return null;
        }
    }
}

module.exports = InsertarAdjuntos;
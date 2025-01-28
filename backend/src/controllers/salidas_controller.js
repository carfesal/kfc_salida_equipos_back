const CrearSalida = require('../services/salidas/crear_salida');
const ObtenerSalida = require('../services/salidas/obtener_salida');
const AutorizarSalida = require('../services/salidas/autorizar_salida');
const CrearDetalleSalida = require('../services/salida_detalles/crear_detalle');
const ObtenerDetalles = require('../services/salida_detalles/obtener_detalles');
const BuscarSalidas = require('../services/salidas/buscar_salidas');
const { buscarSalidasRequest } = require('../requests/salida_request');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const crearSalida = async (req, res) => {
    const datos = req.body;
    datos.responsableId = req.usuario.id;

    try {
        const respuesta = await CrearSalida.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al crear la salida", error: error });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const obtenerSalida = async (req, res) => {
    const id = req.params.id;

    try {
        const respuesta = await ObtenerSalida.ejecutar(id);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al obtener la salida", error: error });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const buscarSalidas = async (req, res) => {
    let datos = req.query;

    try {
        datos = buscarSalidasRequest.parse(datos);
        const respuesta = await BuscarSalidas.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al buscar las salidas", error: error });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const autorizarSalida = async (req, res) => {
    const datos = req.body;
    datos.id = req.params.id;
    datos.usuarioId = req.usuario.id;

    try {
        const respuesta = await AutorizarSalida.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al autorizar la salida", error: error });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearSalidaDetalle = async (req, res) => {
    try {
        const datos = req.body;
        datos.salidaId = req.params.salida_id;

        const respuesta = await CrearDetalleSalida.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        console.log("Error al crear el detalle de la salida: ", error);
        return res.status(500).json({ mensaje: "Ocurrió un error al crear el detalle de la salida", error: error });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const obtenerDetallesSalida = async (req, res) => {
    const salidaId = req.params.salida_id;

    try {
        const detalles = await ObtenerDetalles.ejecutar({salidaId: salidaId});

        return res.status(detalles.codigo).json(detalles);
    } catch (error) {
        console.error("Error al obtener los detalles de la salida: ", error);
        return res.status(500).json({ mensaje: "Ocurrió un error al obtener los detalles de la salida", error: error });
    }
};

module.exports = {
    crearSalida,
    obtenerSalida, 
    buscarSalidas,
    autorizarSalida,
    crearSalidaDetalle,
    obtenerDetallesSalida
};
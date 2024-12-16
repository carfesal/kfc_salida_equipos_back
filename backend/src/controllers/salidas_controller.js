const CrearSalida = require('../services/salidas/crear_salida');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const crearSalida = async (req, res) => {
    const datos = req.body;

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

module.exports = {
    crearSalida
};
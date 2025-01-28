const CrearEquipo = require('../services/equipos/crear_equipo');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearEquipo = async (req, res) => {
    const datos = req.body;

    try {
        const respuesta = await CrearEquipo.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al crear el equipo", error: error });
    }
};

module.exports = {
    crearEquipo
};
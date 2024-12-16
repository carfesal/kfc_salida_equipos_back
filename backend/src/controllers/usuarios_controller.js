
const RegistrarUsuario = require('../services/usuarios/registrar_usuario');
const AutenticarUsuario = require('../services/usuarios/autenticar_usuario');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const autenticarUsuario = async (req, res) => {
    const datos = req.body;

    try {
        const respuesta = await AutenticarUsuario.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al autenticar el usuario", error: error });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const registrarUsuario = async (req, res) => {
    const datos = req.body;

    try {
        const respuesta = await RegistrarUsuario.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al registrar el usuario", error: error });
    }
};

module.exports = {
    autenticarUsuario,
    registrarUsuario
};
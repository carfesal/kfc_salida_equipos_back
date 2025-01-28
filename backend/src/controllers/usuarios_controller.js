
const RegistrarUsuario = require('../services/usuarios/registrar_usuario');
const AutenticarUsuario = require('../services/usuarios/autenticar_usuario');
const ActualizarUusario = require('../services/usuarios/actualizar_usuario');
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

    if (req.usuario.rol !== 'ADMIN') 
        return res.status(403).json({ mensaje: "No tienes permisos para realizar esta acción" });
    
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const buscarUsuarios = async (req, res) => {
    const datos = req.query;

    try {
        const respuesta = await BuscarUsuarios.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al buscar los usuarios", error: error });
    }
};

const cargarCredencial = async (req, res) => {
    const datos = {};

    if (!req.file) {
        return res.status(400).json({ mensaje: "No se ha cargado ningún archivo" });
    }

    datos.credencial = req.file ? req.file.buffer : null;
    datos.usuarioId = req.usuario.id;

    try {
        const respuesta = await CargarCredencial.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al cargar la credencial", error: error });
    }
};

module.exports = {
    autenticarUsuario,
    registrarUsuario,
    buscarUsuarios,
    cargarCredencial
};
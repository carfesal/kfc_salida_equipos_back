const InsertarAdjunto = require('../services/adjuntos/insertar_adjunto');

const crearAdjunto = async (req, res) => {
    const datos = req.body;
    datos.files = req.files ? req.files.map(file => {
        return {
            data: file.buffer,
            mimetype: file.mimetype,
            nombre: file.originalname
        };
    }) : [];
    
    try {
        const respuesta = await InsertarAdjunto.ejecutar(datos);

        if (!respuesta.exito) {
            return res.status(respuesta.codigo).json(respuesta);
        }

        return res.status(respuesta.codigo).json(respuesta);
    } catch (error) {
        return res.status(500).json({ mensaje: "Ocurrió un error al crear el adjunto", error: error });
    }
};

module.exports = {
    crearAdjunto
};
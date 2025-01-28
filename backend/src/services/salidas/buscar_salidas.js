const SalidaRepository = require('../../repositories/salida_repo');
const UsuarioRepository = require('../../repositories/usuario_repo');
const { Op } = require('sequelize');
const { crearRespuesta } = require('../utils');

const construirFiltros = async (datos) => {
    const filtros = {};

    if (datos.cedulaResponsable) {
        const responsable = await UsuarioRepository.obtenerUsuarioPorCedula(datos.cedulaResponsable);

        if (responsable)
            filtros.responsableId = responsable.id;
    }

    if (datos.cedulaAutorizador){
        const autorizador = await UsuarioRepository.obtenerUsuarioPorCedula(datos.cedulaAutorizador);

        if (autorizador)
            filtros.autorizadorId = autorizador.id;
    }

    if (datos.estado) {
        filtros.estado = datos.estado;
    }

    if (datos.fechaDesde) {
        filtros.fecha = {
            [Op.gte]: datos.fechaDesde
        }
    }

    if (datos.fechaHasta) {
        filtros.fecha = {
            [Op.lte]: datos.fechaHasta
        }
    }

    if (datos.motivo) {
        filtros.motivoSalida = {
            [Op.like]: `%${datos.motivo}%`
        }
    }

    return filtros;
};

const associationsToBeReturned = [
    {association: 'responsable', attributes: { exclude: ['password'] }},
    {association: 'autorizador', attributes: { exclude: ['password'] }}
];
class BuscarSalidas {
    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos) {
        try {
            const filtros = await construirFiltros(datos);
            const salidas = await SalidaRepository.buscarSalidas(filtros, associationsToBeReturned);

            return crearRespuesta("Salidas encontradas", salidas, 200, true);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL BUSCAR LAS SALIDAS: ", error);
            return crearRespuesta("Ocurrió un error al buscar las salidas", null, 400, false);
        }
    };
}

module.exports = BuscarSalidas;
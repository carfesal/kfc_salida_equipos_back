const { Op } = require('sequelize');

//DEPENDENCIAS DE PROYECTO 
const UsuarioRepository = require('../../repositories/usuario_repo');
const RolRepository = require('../../repositories/rol_repo');
const { crearRespuesta } = require('../utils');

const construirFiltros = (datos) => {
    const filtros = {};

    if (datos.nombre && datos.nombre !== '') {
        filtros.nombre = Op.like(`%${datos.nombre}%`);
    }

    if (datos.cedula && datos.cedula !== '') {
        filtros.cedula = Op.like(`%${datos.cedula}%`);
    }

    return filtros;
};


class BuscarUsuarios {

    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos) {
        try {
            let filtros = construirFiltros(datos);            

            const usuarios = await UsuarioRepository.buscarUsuarios(filtros);

            if (usuarios.length === 0) {
                return crearRespuesta("No se encontraron usuarios", null, 404, false);
            }

            return crearRespuesta("Usuarios encontrados", usuarios, 200, true);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL BUSCAR USUARIOS: ", error);
            return crearRespuesta("Ocurrió un error al buscar usuarios", null, 500, false);
        }
    }    
}

module.exports = BuscarUsuarios;
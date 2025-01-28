const Usuario = require('../models').Usuario;

class UsuarioRepository {
    /**
     * 
     * @param {*} datos 
     * @returns 
     */
    static async crearUsuario(datos) {
      
        const usuario = await Usuario.create(datos);
        
        if (usuario) {
            return usuario;
        }

        return null;
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    static async obtenerUsuarioPorId(id) {
        const usuario = await Usuario.findByPk(id);

        if (usuario) {
            return usuario;
        }

        return null;
    }

    /**
     * 
     * @param {string} email 
     * @returns 
     */
    static async obtenerUsuarioPorEmail(email) {
        const usuario = await Usuario.findOne({
            where: {
                email
            },
            include: 'rol'
        });

        if (usuario) {
            return usuario;
        }

        return null;
    }

    /**
     * 
     * @param {string} cedula 
     * @returns 
     */
    static async obtenerUsuarioPorCedula(cedula) {
        const usuario = await Usuario.findOne({
            where: {
                cedula
            }
        });

        if (usuario) {
            return usuario;
        }

        return null;
    }

    /**
     * 
     * @param {*} filtros 
     * @returns 
     */
    static async buscarUsuarios(filtros) {
        if (!filtros || Object.keys(filtros).length === 0)
            return [];

        const usuarios = await Usuario.findAll({
            where: filtros
        });

        if (usuarios) {
            return usuarios;
        }

        return [];
    }

    /**
     * 
     * @param {number} id 
     * @param {*} datos 
     * @returns 
     */
    static async actualizarUsuario(id, datos) {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return null;
        }

        const usuarioActualizado = await usuario.update(datos);

        if (usuarioActualizado) {
            return usuarioActualizado;
        }

        return null;
    }
}

module.exports = UsuarioRepository;
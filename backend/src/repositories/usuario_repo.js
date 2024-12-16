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
}

module.exports = UsuarioRepository;
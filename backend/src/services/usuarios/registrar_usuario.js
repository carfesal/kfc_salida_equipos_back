const bcrypt = require('bcrypt');

//DEPENDENCIAS DE PROYECTO 
const UsuarioRepository = require('../../repositories/usuario_repo');
const RolRepository = require('../../repositories/rol_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 */
class RegistrarUsuario {
    
    /**
     * 
     * @param {*} datos 
     * @returns 
     */
    static async ejecutar(datos) {
        try {
            const usuarioExistente = await this.usuarioYaExiste(datos.email, datos.cedula);

            if (usuarioExistente) {
                return crearRespuesta("Usuario con esa informacion ya existe", null, 400, false);
            }

            const contraseniaEncriptada = await bcrypt.hash(datos.password, 10);
            datos.password = contraseniaEncriptada;
            
            const rol = await this.obtenerRolPorNombre(datos.rol);

            if (!rol) {
                return crearRespuesta(`Rol[${datos.rol}] no encontrado`, null, 404, false);
            }
            
            datos.rolId = rol.id;
            const usuario = await UsuarioRepository.crearUsuario(datos);

            if (usuario) {
                delete usuario.password;
                return crearRespuesta("Usuario creado correctamente", usuario, 201, true);
            }
            
            delete datos.password;
            return crearRespuesta("No se pudo crear el usuario", null, 400, false);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL REGISTRAR USUARIO: ", error);
            return crearRespuesta("Ocurrió un error al registrar el usuario", null, 500, false);
        }
    }
    
    /**
     * 
     * @param {*} email 
     * @param {*} cedula 
     */
    static async usuarioYaExiste(email, cedula) {
        let usuarioExistente = await this.obtenerUsuarioPorEmail(email);

        if (usuarioExistente) return true;

        usuarioExistente = await this.obtenerUsuarioPorCedula(cedula);

        if (usuarioExistente) return true;

        return false;
    }

    /**
     * 
     * @param {string} nombre 
     * @returns 
     */
    static async obtenerRolPorNombre(nombre) {        
        if (!nombre) 
            return null;
        const rol = await RolRepository.obtenerRolPorNombre(nombre);
        return rol;
    }

    /**
     * 
     * @param {*} email 
     * @returns 
     */
    static async obtenerUsuarioPorEmail(email) {
        if (!email) 
            return null;
        const usuario = await UsuarioRepository.obtenerUsuarioPorEmail(email);
        return usuario;
    }

    static async obtenerUsuarioPorCedula(cedula) {
        if (!cedula) 
            return null;
        const usuario = await UsuarioRepository.obtenerUsuarioPorCedula(cedula);
        return usuario;
    }
}
module.exports = RegistrarUsuario;
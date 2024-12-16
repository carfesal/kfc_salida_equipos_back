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

            const usuarioExistente = await this.obtenerUsuarioPorEmail(datos.email);

            if (usuarioExistente) {
                return crearRespuesta("Usuario ya registrado", null, 400, false);
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
}
module.exports = RegistrarUsuario;
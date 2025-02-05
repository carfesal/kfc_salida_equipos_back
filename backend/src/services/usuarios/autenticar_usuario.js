const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//DEPENDENCIAS DE PROYECTO
const UsuarioRepository = require('../../repositories/usuario_repo');
const { crearRespuesta } = require('../utils');
const appConfig = require('../../config/app');
const app = require('../../config/app');

/**
 * 
 */
class AutenticarUsuario {
    static async ejecutar(datos) {
        try {
            if (!datos.email || !datos.password) {
                return crearRespuesta("Datos incompletos", null, 400, false);
            }

            const usuarioAutenticado = await UsuarioRepository.obtenerUsuarioPorEmail(datos.email);

            if (!usuarioAutenticado) {
                return crearRespuesta("Usuario no encontrado", null, 404, false);
            }

            const contraseniaValida = await bcrypt.compare(datos.password, usuarioAutenticado.password);

            if (!contraseniaValida) {
                return crearRespuesta("Contraseña incorrecta", null, 400, false);
            }

            return crearRespuesta("Usuario autenticado correctamente", {
                usuario: usuarioAutenticado.username,
                token: this.generarToken(usuarioAutenticado)
            }, 200, true);
        } catch (error) {
            console.error("OCURRIO UN ERROR AL AUTENTICAR USUARIO: ", error);
            throw error;
        }
    }
    
    /**
     * 
     * @param {} usuario 
     * @returns 
     */
    static generarToken(usuario) {
        const payload = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol.nombre
        };

        const token = jwt.sign(payload, appConfig.jwtSecret, {
            expiresIn: '24h'
        });

        return token;
    }
}

module.exports = AutenticarUsuario;
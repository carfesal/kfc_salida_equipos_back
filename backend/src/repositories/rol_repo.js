const Rol = require('../models').Rol;

class RolRepository {
    /**
     * 
     * @param {string} nombre 
     */
    static async obtenerRolPorNombre(nombre) {
        const rol = await Rol.findOne({
            where: {
                nombre
            }
        });

        if (rol) {
            return rol;
        }

        return null;
    }

    /**
     * 
     * @returns 
     */
    static async obtenerRoles() {
        const roles = await Rol.findAll();

        if (roles) {
            return roles;
        }

        return null;
    }

    /**
     * 
     * @param {*} nombre 
     * @param {*} descripcion 
     */
    static async crearRol(nombre, descripcion) {
        const rol = await Rol.create({
            nombre,
            descripcion
        });

        if (rol) {
            return rol;
        }

        return null
    }

    /**
     * 
     * @param {number} id 
     * @returns 
     */
    static async obtenerRolPorId(id) {
        const rol = await Rol.findByPk(id);

        if (rol) {
            return rol;
        }

        return null;
    }
}

module.exports = RolRepository;
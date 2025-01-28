const Permiso = require('../models').Permiso;

class PermisoRepository {
    /**
     * 
     * @param {*} nombre 
     * @returns 
     */
    static async obtenerPermisoPorNombre(nombre) {
        const permiso = await Permiso.findOne({
            where: {
                nombre
            }
        });

        if (permiso) {
            return permiso;
        }

        return null;
    }

    /**
     * 
     * @param {*} nombre 
     * @param {*} descripcion 
     * @returns 
     */
    static async crearPermiso(nombre, descripcion) {
        const permiso = await Permiso.create({
            nombre,
            descripcion
        });

        if (permiso) {
            return permiso;
        }

        return null;
    }
    
    /**
     * 
     * @param {*} permiso 
     * @param {*} rol 
     */
    static async agregarRol(id, rol) {
        const permiso = await Permiso.findByPk(id);

        if(!permiso) {
            return false;
        }

        if (permiso.hasRol(rol)) {
            return true;
        }

        await permiso.addRol(rol);

        return true;
    }
}

module.exports = PermisoRepository;
const Lugar = require('../models').Lugar;

class LugarRepository {
    /**
     * 
     * @param {*} nombre 
     * @returns 
     */
    static async obtenerLugarPorNombre(nombre) {
        const lugar = await Lugar.findOne({
            where: {
                nombre
            }
        });

        if (lugar) {
            return lugar;
        }

        return null;
    }

    /**
     * 
     * @param {*} nombre 
     * @param {*} descripcion 
     * @returns 
     */
    static async crearLugar(nombre, direccion) {
        const lugar = await Lugar.create({
            nombre,
            direccion
        });

        if (lugar) {
            return lugar;
        }

        return null;
    }
}

module.exports = LugarRepository;
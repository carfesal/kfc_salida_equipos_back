const SalidaDetalle = require('../models').SalidaDetalle;

class SalidaDetalleRepository {
    /**
     * 
     * @param {*} datos 
     */
    static async createSalidaDetalle(datos) {
        const salidaDetalle = await SalidaDetalle.create(datos);

        if (salidaDetalle) {
            return salidaDetalle;
        }

        return null;
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    static async obtenerSalidaDetallePorId(id) {
        const salidaDetalle = await SalidaDetalle.findByPk(id);

        if (!salidaDetalle) return null;

        return salidaDetalle;
    }

    /**
     * 
     * @param {*} salidaId 
     * @returns 
     */
    static async obtenerSalidaDetallesPorSalidaId(salidaId, relaciones = []) {
        const salidaDetalles = await SalidaDetalle.findAll({
            where: {
                salidaId: salidaId
            },
            include: relaciones
        });

        if (!salidaDetalles || salidaDetalles.length === 0) return [];

        return salidaDetalles;
    }

    /**
     * 
     * @param {*} id 
     * @param {*} datos 
     * @returns 
     */
    static async actualizarSalidaDetalle(id, datos) {
        const salidaDetalle = await SalidaDetalle.findByPk(id);

        if (!salidaDetalle) return null;

        return await salidaDetalle.update(datos);
    }
}

module.exports = SalidaDetalleRepository;
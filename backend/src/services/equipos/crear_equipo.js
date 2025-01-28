const EquipoRepository = require('../../repositories/equipo_repo');
const { crearRespuesta } = require('../utils');

/**
 * 
 */
class CrearEquipo{
    /**
     * 
     * @param {*} datos 
     */
    static async ejecutar(datos){
        try {
            const equipo = await EquipoRepository.create(datos);

            if (!equipo) 
                return crearRespuesta("No se pudo crear el equipo", null, 400, false);
            
            return crearRespuesta("Equipo creado correctamente", equipo, 201, true);
        } catch (error) {
            console.log("Error mientras se creaba el equipo: ", error);
            return crearRespuesta("Ocurrió un error mientras se creaba el equipo", null, 500, false);
        }
    }
}

module.exports = CrearEquipo;
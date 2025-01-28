const { z } = require('zod');

const crearEquipoRequest = z.object({
    nombre: z.string().min(2).max(50),
    marca: z.string().min(2).max(50),
    modelo: z.string().min(2).max(50),
    serie: z.string().min(2).max(50),
    descripcion: z.string().min(2).max(250)
});

module.exports = {
    crearEquipoRequest
};
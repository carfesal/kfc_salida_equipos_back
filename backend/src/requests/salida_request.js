const {z} = require('zod');

const crearSalidaRequest = z.object({
    motivoSalida: z.string().min(2).max(255),
    fechaHoraSalida: z.string().datetime()
});

module.exports = {
    crearSalidaRequest
};
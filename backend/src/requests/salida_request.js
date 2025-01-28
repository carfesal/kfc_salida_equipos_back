const {z} = require('zod');

const crearSalidaRequest = z.object({
    motivoSalida: z.string().min(2).max(255),
    fechaHoraSalida: z.string().datetime()
});

const autorizarSalidaRequest = z.object({
    autorizado: z.boolean().default(false)
});

const crearSalidaDetalleRequest = z.object({
    nombreEquipo: z.string().min(2).max(50),
    marcaEquipo: z.string().min(2).max(50),
    modeloEquipo: z.string().min(2).max(50),
    serieEquipo: z.string().min(2).max(50),
    descripcionEquipo: z.string().min(2).max(250),
    nombreDestino: z.string().min(2).max(50),
    cantidad: z.number().int().positive(),
    responsableId: z.number().int().positive().optional()
});


const buscarSalidasRequest = z.object({
    motivo: z.string().min(2).max(255).optional(),
    cedulaAutorizador: z.string().min(2).max(50).optional(),
    cedulaResponsable: z.string().min(2).max(50).optional(),
    fechaDesde: z.string().datetime().optional(),
    fechaHasta: z.string().datetime().optional(),
    estado: z.enum(['PND', 'AUT', 'REC']).optional()
});

module.exports = {
    crearSalidaRequest,
    autorizarSalidaRequest,
    crearSalidaDetalleRequest,
    buscarSalidasRequest
};
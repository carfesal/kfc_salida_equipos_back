const { z } = require('zod');

const crearAdjuntoRequest = z.object({
    salidaDetalleId: z.coerce.number().nonnegative()    
});

module.exports = {
    crearAdjuntoRequest
}; 
const { z } = require('zod');

const registrarUsuarioRequest = z.object({
    nombre: z.string().min(2).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
    cedula: z.string().min(10).max(10),
    username: z.string().min(2).max(255),
    rol: z.string().min(2).max(255).default('USUARIO'),
});


const loguearUsuarioRequest = z.object({
    email: z.string().email(),
    password: z.string().max(255),
});

module.exports = {
    registrarUsuarioRequest,
    loguearUsuarioRequest
};
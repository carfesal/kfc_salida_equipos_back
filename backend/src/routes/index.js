const equiposRouter = require('./equipos_routes');
const usuariosRouter = require('./usuario_routes');
const adjuntosRouter = require('./adjuntos_routes');
const salidasRouter = require('./salidas_routes');

module.exports = {
    equiposRouter: equiposRouter,
    usuariosRouter: usuariosRouter,
    adjuntosRouter: adjuntosRouter,
    salidasRouter: salidasRouter
}
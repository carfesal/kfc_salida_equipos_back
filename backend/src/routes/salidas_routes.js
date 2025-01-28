const express = require("express");
const router = express.Router();

const { verifyToken } = require('../middlewares/auth_middleware');
const validateRequest = require('../middlewares/request_middleware');
const SalidaRequest = require('../requests/salida_request');
const SalidaController = require('../controllers/salidas_controller');

// ALL ROUTES
router.post("", verifyToken, validateRequest(SalidaRequest.crearSalidaRequest), SalidaController.crearSalida);
router.get("/:id", verifyToken, SalidaController.obtenerSalida);
router.get("", verifyToken, SalidaController.buscarSalidas);
router.patch("/:id/autorizar", verifyToken, validateRequest(SalidaRequest.autorizarSalidaRequest), SalidaController.autorizarSalida);
router.post("/:salida_id/detalles", verifyToken, validateRequest(SalidaRequest.crearSalidaDetalleRequest), SalidaController.crearSalidaDetalle);
router.get("/:salida_id/detalles", verifyToken, SalidaController.obtenerDetallesSalida);

module.exports = router;
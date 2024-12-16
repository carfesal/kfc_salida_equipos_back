const express = require("express");
const router = express.Router();

const { verifyToken } = require('../middlewares/auth_middleware');
const { validateRequest } = require('../middlewares/request_middleware');
const SalidaRequest = require('../requests/salida_request');
const SalidaController = require('../controllers/salidas_controller');

// ALL ROUTES
router.post("", verifyToken, validateRequest(SalidaRequest.crearSalidaRequest), SalidaController.crearSalida);
router.get("/:id", verifyToken, SalidaController.obtenerSalidas);
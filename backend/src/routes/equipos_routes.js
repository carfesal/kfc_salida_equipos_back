const express = require("express");
const router = express.Router();

const EquipoController = require('../controllers/equipos_controller');
const { verifyToken } = require('../middlewares/auth_middleware');
const validateRequest = require('../middlewares/request_middleware');
const EquipoRequests = require('../requests/equipo_request');

router.post("", verifyToken, validateRequest(EquipoRequests.crearEquipoRequest), EquipoController.crearEquipo);

module.exports = router;
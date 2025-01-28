const express = require("express");
const router = express.Router();

const AdjuntoRequests = require("../requests/adjunto_request");
const AdjuntosController = require("../controllers/adjuntos_controller");
const { verifyToken } = require("../middlewares/auth_middleware");
const validateRequest = require("../middlewares/request_middleware");
const { memoryStorageUpload } = require("../middlewares/file_storage_middleware");

// ALL ROUTES
router.post("", verifyToken, memoryStorageUpload.array("archivos", 10), validateRequest(AdjuntoRequests.crearAdjuntoRequest), AdjuntosController.crearAdjunto);

module.exports = router;
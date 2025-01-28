const express = require("express");
const router = express.Router();

const UsuarioRequests = require("../requests/usuario_request");
const usuariosController = require("../controllers/usuarios_controller");
const validateRequest = require("../middlewares/request_middleware");
const { verifyToken } = require("../middlewares/auth_middleware");
const { memoryStorageUpload } = require("../middlewares/file_storage_middleware");

// ALL ROUTES
router.post("", verifyToken, validateRequest(UsuarioRequests.registrarUsuarioRequest), usuariosController.registrarUsuario);
router.post("/login", validateRequest(UsuarioRequests.loguearUsuarioRequest), usuariosController.autenticarUsuario);
router.get("/search", verifyToken, usuariosController.buscarUsuarios);
router.patch("/upload_credencial", verifyToken, memoryStorageUpload.single("credencial"), usuariosController.cargarCredencial);

module.exports = router;
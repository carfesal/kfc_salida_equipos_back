const express = require("express");
const router = express.Router();

const UsuarioRequests = require("../requests/usuario_request");
const usuariosController = require("../controllers/usuarios_controller");
const validateRequest = require("../middlewares/request_middleware");

// ALL ROUTES
router.post("", validateRequest(UsuarioRequests.registrarUsuarioRequest), usuariosController.registrarUsuario);
router.post("/login", validateRequest(UsuarioRequests.loguearUsuarioRequest), usuariosController.autenticarUsuario);

module.exports = router;
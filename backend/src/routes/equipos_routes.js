const express = require("express");
const router = express.Router();

// ALL ROUTES
router.get("/", (req, res) => {
    res.send("Hola desde la ruta de equipos");
});

module.exports = router;
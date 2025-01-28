require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const settings = require('./src/config/app');
const database = require('./src/database/index');
const router = require('./src/routes/index');

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
database.authenticate().then(() => console.log("Database connected successfully")).catch(err => console.error('Error al conectar con el servidor SQL Server:', err));

// Configuración de las rutas
app.use('/salida_equipos/v1/equipos', router.equiposRouter);
app.use('/salida_equipos/v1/usuarios', router.usuariosRouter);
app.use('/salida_equipos/v1/adjuntos', router.adjuntosRouter);
app.use('/salida_equipos/v1/salidas', router.salidasRouter);

app.listen(settings.port, () => {
  console.log(`Corriendo en el puerto ${settings.port}`);
});
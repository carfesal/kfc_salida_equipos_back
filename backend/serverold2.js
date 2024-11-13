const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Habilita CORS para permitir solicitudes desde otros orígenes
app.use(cors());

// Importa los backends existentes
const backend1 = require('./tecnico');
const backend2 = require('./ubicacion');
const backend3 = require('./store');
const backend4 = require('./s_paneles');
const backend5 = require('./login');
const backend6 = require('./salidaEquipos');
const backend7 = require('./s_equipos');
// const backend8 = require('./mailReporteSalida');

// Sirve archivos estáticos desde la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Rutas para los backends existentes, todos escuchando en el mismo servidor
app.use('/tecnico', backend1);
app.use('/ubicacion', backend2);
app.use('/store', backend3);
app.use('/s_paneles', backend4);
app.use('/login', backend5);
app.use('/salidaEquipos', backend6);
app.use('/s_equipos', backend7);
// app.use('/mailReporteSalida', backend8);

// Ruta para manejar todas las demás solicitudes y devolver el archivo 'index.html' del build
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configura el puerto para el servidor Express
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
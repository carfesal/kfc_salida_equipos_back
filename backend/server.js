// server.js

/*
const backend1 = require('./tecnico');
const backend2 = require('./ubicacion'); 
const backend3 = require('./store');
const backend4 = require('./s_paneles');
const backend5 = require('./login');

const backend6 = require('./salidaEquipos'); 
const backend7 = require('./s_equipos');


backend1.listen(3002, () => {
  console.log('Backend tecnico (registro)');
});

backend2.listen(3003, () => {
  console.log('Backend ubicacion (Regitro)');
});

backend3.listen(3004, () => {
  console.log('Backend store (Regitro y actualiza)');
});

backend4.listen(3006, () => {
  console.log('Backend s_paneles (Consulta)');
});

backend5.listen(3010, () => {
  console.log('Backend login (valida ingreso)');
});

backend6.listen(3015, () => {
  console.log('Backend salidaEquipos (Regitra)');
});

backend7.listen(3005, () => {
  console.log('Backend s_equipos (Consulta)');
});
*/

//CORRER BACKENDS JUNTO CON FONTEND
const express = require('express');
const path = require('path');
const app = express();

// Configura los backends existentes
const backend1 = require('./tecnico');
const backend2 = require('./ubicacion'); 
const backend3 = require('./store');
const backend4 = require('./s_paneles');
const backend5 = require('./login');
const backend6 = require('./salidaEquipos'); 
const backend7 = require('./s_equipos');
//const backend8 = require('./mailReporteSalida');

// Sirve archivos estáticos desde la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Rutas para los backend existentes
backend1.listen(3002, () => {
  console.log('Backend tecnico (registro)');
});

backend2.listen(3003, () => {
  console.log('Backend ubicacion (Regitro)');
});

backend3.listen(3004, () => {
  console.log('Backend store (Regitro y actualiza)');
});

backend4.listen(3006, () => {
  console.log('Backend s_paneles (Consulta)');
});

backend5.listen(3010, () => {
  console.log('Backend login (valida ingreso)');
});

backend6.listen(3015, () => {
  console.log('Backend salidaEquipos (Registra)');
});

backend7.listen(3005, () => {
  console.log('Backend s_equipos (Consulta)');
});

/*backend8.listen(3016, () => {
  console.log('Backend MailReporteSalida (Tarea)');
});*/
// Ruta para manejar todas las demás solicitudes y devolver el archivo 'index.html' del build
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configura el puerto para el servidor Express
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});



// server.js
const express = require('express');
const adb = require('adbkit');
const { exec } = require('child_process'); // Módulo para ejecutar comandos en el sistema operativo
const client = adb.createClient();

const app = express();
const PORT = process.env.PORT || 3007;

const cors = require("cors");

app.use(cors());
app.use(express.json());

// Ruta para obtener el número de serie usando ADB
app.get('/device-serial', async (req, res) => {
  const { ip } = req.query;
  console.log('IP recibida en el servidor:', ip);

  if (!ip) {
    return res.status(400).send('IP address is required');
  }

  try {
    // Ejecutar comando ADB para obtener el número de serie
    exec(`adb -s ${ip} shell getprop ro.serialno`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing ADB command:', error);
        return res.status(500).send('Error executing ADB command');
      }
      if (stderr) {
        console.error('ADB command returned error:', stderr);
        return res.status(500).send('ADB command returned error');
      }
      const serialNo = stdout.trim(); // Limpiar el resultado del comando ADB
      
      console.log('Número de Serie devuelto:', serialNo);
      res.send({ serialNo });
    });
  } catch (err) {
    console.error('Error fetching serial number:', err);
    res.status(500).send(err.message);
  }
});

app.get('/device-name', async (req, res) => {
  const { ip } = req.query;
  console.log('IP recibida en el servidor:', ip);

  if (!ip) {
    return res.status(400).send('IP address is required');
  }

  try {
    // Ejecutar comando ADB para obtener el número de serie
    exec(`adb -s ${ip} shell getprop ro.product.model`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing ADB command:', error);
        return res.status(500).send('Error executing ADB command');
      }
      if (stderr) {
        console.error('ADB command returned error:', stderr);
        return res.status(500).send('ADB command returned error');
      }
      const serialNo = stdout.trim(); // Limpiar el resultado del comando ADB
      
      console.log('Nombre devuelto:', serialNo);
      res.send({ serialNo });
    });
  } catch (err) {
    console.error('Error fetching serial number:', err);
    res.status(500).send(err.message);
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express=require("express");
const app = express();
const mssql = require("mssql");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');

app.use(cors());
app.use(express.json());

// Configuración de conexión a SQL Server
const config = {
    user: "sa",
    password: "Lospelado90",
    server: "192.168.110.53",
    database: "LABORATORIO",
    port: 1433,
    options: {
      encrypt: false, // Desactivar el cifrado TLS
      trustServerCertificate: true, // Ignorar errores de certificado
    },
  };
  
  // Middleware para procesar cuerpos de solicitud JSON
app.use(bodyParser.json());

// Crear un pool de conexiones
const pool = new mssql.ConnectionPool(config);

// Conectar el pool a la base de datos
pool.connect()
  .then(() => console.log('Conexión exitosa al servidor SQL Server'))
  .catch(err => console.error('Error al conectar con el servidor SQL Server:', err));


// HOJA DE SALIDA DE EQUIPOS
app.get("/HojaSalida", async (req, res) => {
  const { local, local2} = req.query;
  console.log('Received query parameters:', { local, local2 }); // Agregar este log

  try {
    
    const request = pool.request();
    const query = `
     SELECT TOP 50 * FROM dbo.fn_FiltrarSalidasPorFecha(@local, @local2)
      ORDER BY id_salida DESC;
    `;

    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);

    console.log(result.recordset);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener Tabla de hoja de salida" });
  }
});

// HOJA DE SALIDA DE EQUIPOS SIN FECHA
app.get("/HojaSalida2", async (req, res) => {
  const { local, local2 } = req.query;
  console.log('Received query parameters:', { local, local2 });

  try {
      const request = pool.request();
      const query = `
          SELECT * FROM dbo.fn_FiltrarSalidasSinFecha(@ID_SALIDA, @CEDULA_RESPONSABLE)
          ORDER BY id_salida DESC;
      `;

      request.input("ID_SALIDA", mssql.Int, local || null);
      request.input("CEDULA_RESPONSABLE", mssql.NVarChar(11), local2 || null);

      const result = await request.query(query);

      console.log(result.recordset);

      res.json(result.recordset);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener Tabla de hoja de salida" });
  }
});
// Endpoint para obtener las imágenes por ID_SALIDA// Endpoint para obtener las imágenes por local
// Endpoint para obtener las imágenes por ID_SALIDA
app.get('/getImages', async (req, res) => {
  const { id_salida } = req.query; // Cambiado a req.query para obtener el parámetro de consulta

  if (!id_salida) {
    return res.status(400).send('Falta el parámetro id_salida');
  }

  try {
    // Consulta para obtener las imágenes asociadas a un ID_SALIDA específico
    const result = await pool.request()
      .input('id_salida', mssql.Int, id_salida)
      .query(`
        SELECT * FROM dbo.fn_ImagenesSalida2(@id_salida) ORDER BY id_salida DESC; 
      `);
      
    if (result.recordset.length > 0) {
      // Retorna las imágenes en formato base64
      const images = result.recordset.map(row => Buffer.from(row.IMAGEN_FOTO).toString('base64'));
      res.json(images); // Retorna un array de imágenes en formato base64
      console.log(images);

      console.log(result.recordset.map(row => Buffer.from(row.IMAGEN_FOTO).toString('base64')));
    } else {
      res.status(404).send('No se encontraron imágenes para esta salida.');
    }
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para obtener las imágenes por ID_SALIDA
app.get('/getImages2', async (req, res) => {
  const { id_salida } = req.query;

  if (!id_salida) {
      return res.status(400).send('Falta el parámetro id_salida');
  }

  try {
      // Consulta para obtener las imágenes asociadas a un ID_SALIDA específico
      const result = await pool.request()
          .input('id_salida', mssql.Int, id_salida)
          .query(`
              SELECT * FROM dbo.fn_ImagenesSalida2(@id_salida) ORDER BY ID_SALIDA DESC;
          `);

      if (result.recordset.length > 0) {
          // Retorna las imágenes en formato base64
          const images = result.recordset.map(row => Buffer.from(row.IMAGEN_FOTO).toString('base64'));
          res.json(images); // Retorna un array de imágenes en formato base64
          console.log(images);
      } else {
          res.status(404).send('No se encontraron imágenes para esta salida.');
      }
  } catch (error) {
      console.error('Error al obtener las imágenes:', error);
      res.status(500).send('Error interno del servidor');
  }
});




app.listen(3005, () => {
  console.log("Corriendo en el puerto 3005");
});
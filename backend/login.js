const express=require("express");
const app = express();
const mssql = require("mssql");
const cors = require("cors");
const bodyParser = require('body-parser');


app.use(cors());
app.use(express.json());

// Middleware para procesar cuerpos de solicitud JSON
app.use(bodyParser.json());

// Configuración de conexión a SQL Server
const config = {
    user: "sa",
    password: "jcjajplae*88",
    server: "192.168.110.53\\MAXPOINT",
    database: "LABORATORIO",
    port: 1433,
    options: {
      encrypt: false, // Desactivar el cifrado TLS
      trustServerCertificate: true, // Ignorar errores de certificado
    },
  };
  
  

// Crear un pool de conexiones
const pool = new mssql.ConnectionPool(config);

// Conectar el pool a la base de datos
pool.connect()
  .then(() => console.log('Conexión exitosa al servidor SQL Server'))
  .catch(err => console.error('Error al conectar con el servidor SQL Server:', err));


// INSERTAR TÉCNICO DE ZONA

// FILTRAR UBICACIÓN POR LOCAL
app.post("/ValidarLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Obtener una nueva solicitud del grupo de conexiones (pool)
    const request = await pool.request();

    // Consulta SQL para obtener el ID_PC filtrando por el nombre del PC
    const query = "SELECT * FROM TECNICO_ZONA WHERE CORREO_TZ= @email AND CI_TZ= @password ";

    // Establecer el parámetro del email, pass
    request.input("email", mssql.NVarChar, email); 
    request.input("password", mssql.Int, password); 

    // Ejecutar la consulta SQL
    const result = await request.query(query);
    
    if (result.recordset.length > 0) {
      // Si el usuario existe
      res.status(200).send({ message: 'Inicio de sesión exitoso' });
      console.log('Se ha iniciado sesión con éxito');
    } else {
      // Si el usuario no existe
      res.status(401).send({ message: 'Correo electrónico o contraseña incorrectos' });
      console.log('Datos incorrectos');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error interno del servidor' });
    console.log('error');
  }
});

// Validar Cédula
app.post("/validarCedula", async (req, res) => {
  const { cedula } = req.body;

  try {
    const request = await pool.request();
    const query = "SELECT * FROM TECNICO_ZONA WHERE CI_TZ = @cedula";
    request.input("cedula", mssql.Int, cedula);
    const result = await request.query(query);

    if (result.recordset.length > 0) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
});

module.exports = app;

/*app.listen(3010, () => {
  console.log("Corriendo en el puerto 3010");
});*/



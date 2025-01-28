const express=require("express");
const app = express();
const mssql = require("mssql");
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());

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
  
  // Middleware para procesar cuerpos de solicitud JSON
app.use(bodyParser.json());

// Crear un pool de conexiones
const pool = new mssql.ConnectionPool(config);

// Conectar el pool a la base de datos
pool.connect()
  .then(() => console.log('Conexión exitosa al servidor SQL Server'))
  .catch(err => console.error('Error al conectar con el servidor SQL Server:', err));

// Ruta para manejar la solicitud POST

// COMBO CADENA
app.get("/comboCadena", async (req, res) => {
  try {
    // Obtener una nueva solicitud del grupo de conexiones (pool)
    const request = await pool.request();

    // Consulta SQL para obtener solo los nombres de la columna NOMBRE_ST
    const query = "SELECT DISTINCT DESCRIP_ST FROM STORE ORDER BY DESCRIP_ST ASC;";

    // Ejecutar la consulta SQL
    const result = await request.query(query);

    // Mapear los resultados para extraer solo los nombres
    const nombres = result.recordset.map(row => row.DESCRIP_ST);

    // Enviar los nombres como respuesta
    res.json(nombres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos de la tabla" });
  }
});

// COMBO LOCAL
app.get("/comboStore", async (req, res) => {
  const { local } = req.query;

  try {
    // Obtener una nueva solicitud del grupo de conexiones (pool)
    const request = await pool.request();

    // Consulta SQL para obtener solo los nombres de la columna NOMBRE_ST
    const query = "SELECT NOMBRE_ST FROM STORE WHERE DESCRIP_ST= @local ORDER BY CAST(SUBSTRING(NOMBRE_ST, PATINDEX('%[0-9]%', NOMBRE_ST), LEN(NOMBRE_ST)) AS INT) ASC";

    // Establecer el parámetro del local seleccionado
    request.input("local", mssql.NVarChar, local);

    const result = await request.query(query);
    const nombres = result.recordset.map(row => row.NOMBRE_ST);

    // Enviar los nombres como respuesta
    res.json(nombres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos de la tabla" });
  }
});

// COMBOBOX FILTRAR PC POR LOCAL
app.get("/comboPC", async (req, res) => {
  const { local } = req.query;

  try {
    // Obtener una nueva solicitud del grupo de conexiones (pool)
    const request = await pool.request();

    // Consulta SQL para obtener solo los nombres de la columna NOMBRE_ST
    const query = "SELECT PC.ID_PC ,STORE.NOMBRE_ST, PC.NOMBRE_PC, PC.SERIE_PC FROM dbo.STORE INNER JOIN dbo.PC ON dbo.STORE.ID_ST = dbo.PC.ID_ST WHERE dbo.STORE.NOMBRE_ST= @local";

    // Establecer el parámetro del local seleccionado
    request.input("local", mssql.NVarChar, local);

    const result = await request.query(query);
    const nombres = result.recordset.map(row => row.NOMBRE_PC);

    // Enviar los nombres como respuesta
    res.json(nombres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos de la tabla" });
  }
});

//FILTRAR STATUS POR PC
app.get("/status", async (req, res) => {
  const { namepc } = req.query;

  try {
    // Obtener una nueva solicitud del grupo de conexiones (pool)
    const request = await pool.request();

    // Consulta SQL para obtener solo el estado de la PC
    const query = "SELECT PC.STATUS_PC FROM PC WHERE NOMBRE_PC= @namepc";

    // Establecer el parámetro del nombre de la PC
    request.input("namepc", mssql.NVarChar, namepc);

    const result = await request.query(query);
    
    // Verificar si se encontró un estado
    if (result.recordset.length > 0) {
      const status = result.recordset[0].STATUS_PC;
      res.json({ status });
    } else {
      res.status(404).json({ message: "No se encontró el estado para la PC especificada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos de la tabla" });
  }
});
// MOSTRAR TABLA PRINCIPAL - LOCAL_PC PRUEBAAAAAAAAA
app.get("/filtroNombrePc2", async (req, res) => {
  const { local, local2, local3, local4, local5, local6, local7 } = req.query;
  console.log('Received query parameters:', { local, local2, local3, local4, local5, local6, local7 }); // Agregar este log

  try {
    
    const request = pool.request();
    const query = `
      SELECT * FROM dbo.FiltrarTablaEquipos(@local, @local2, @local3, @local4, @local5, @local6, @local7)
      ORDER BY CAST(SUBSTRING(NOMBRE_ST, PATINDEX('%[0-9]%', NOMBRE_ST), LEN(NOMBRE_ST)) AS INT) ASC;
    `;

    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);
    request.input("local3", mssql.NVarChar, local3);
    request.input("local4", mssql.NVarChar, local4);
    request.input("local5", mssql.NVarChar, local5);
    request.input("local6", mssql.NVarChar, local6);
    request.input("local7", mssql.NVarChar, local7);

    const result = await request.query(query);

    console.log(result.recordset);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener Tabla de equipos" });
  }
});


app.post("/updateStatus", async (req, res) => {
  const { campo1, campo2 } = req.body;

  // Verificar si nombre, nuevoValorCampo1 y nuevoValorCampo2 están presentes en el cuerpo de la solicitud
  if (!campo1 || !campo2) {
    return res.status(400).send("Los campos nombre, nuevoValorCampo1 y nuevoValorCampo2 son requeridos");
  }
  try {
    // Obtener una nueva solicitud del grupo de conexiones (pool)
    const request = await pool.request();

    // Establecer los parámetros de entradaa
    request.input("campo1", mssql.NVarChar, campo1);
    request.input("campo2", mssql.NVarChar, campo2);

    await request.query(
      "UPDATE PC SET STATUS_PC = @campo2 WHERE NOMBRE_PC = @campo1"
    );      

    console.log(request.query);

    res.send("Tienda modificada con éxito!!!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al modificar la tienda");
  }
});


app.listen(3005, () => {
  console.log("Corriendo en el puerto 3005");
});
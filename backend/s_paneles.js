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

// GRID TOTAL CADENAS
app.get("/FillTotalCadenas", async (req, res) => {
  const { local } = req.query;
  try {
    // Obtener una nueva solicitud del grupo de conexiones (pool)
    const request = await pool.request();

    // Consulta SQL para obtener solo los nombres de la columna NOMBRE_ST
    const query = "select dbo.FiltrarCadenas(@local) AS Cadenas_Total;";

    request.input("local", mssql.NVarChar, local);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Cadenas_Total;

    console.log('CADENAS: ', result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de locales" });
  }
});
// Ruta para obtener el total de locales filtrado
app.get("/FillTotalLocales", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarLocales2(@local, @local2) AS Locales_Total;";

    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Locales_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de locales" });
  }
});

app.get("/FillTotalPos", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarCajas(@local, @local2) AS Cajas_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Cajas_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de servidores" });
  }
});

app.get("/FillTotalServer", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarServidores(@local, @local2) AS Servidores_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Servidores_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de servidores" });
  }
});

app.get("/FillTotalMinipc", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarMinipc(@local, @local2) AS Minipc_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Minipc_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalHeladeria", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarHeladerias(@local,@local2) AS Heladerias_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Heladerias_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalPosiflex", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarPosiflex(@local, @local2) AS Posiflex_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Posiflex_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalAllinOne", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarAllinOne(@local, @local2) AS AllinOne_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].AllinOne_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de All In One" });
  }
});

app.get("/FillTotalZKTeco", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarZKTeco(@local, @local2) AS ZKTeco_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].ZKTeco_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalPar7200", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarPar7200(@local, @local2) AS Par7200_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Par7200_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalNcr", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarNcr(@local, @local2) AS NCR_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].NCR_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalPar500", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarPar500(@local, @local2) AS Par500_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Par500_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalSenor", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarSenor(@local, @local2) AS Senor_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Senor_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalPar2000", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarPar2000(@local, @local2) AS Par2000_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Par2000_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalOptiplex", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarOptiplex(@local, @local2) AS Optiplex_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Optiplex_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalNuc", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarNuc(@local, @local2) AS Nuc_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].Nuc_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalSrvDell", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarSrvDell(@local, @local2) AS SrvDell_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].SrvDell_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalSrvLenovo", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarSrvLenovo(@local, @local2) AS SrvLenovo_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].SrvLenovo_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

app.get("/FillTotalSrvSupermicro", async (req, res) => {
  const { local, local2 } = req.query;

  try {
    const request = await pool.request();
    const query = "SELECT dbo.FiltrarSrvSupermicro(@local, @local2) AS SrvSupermicro_Total;";

    // Establecer los parámetros individualmente
    request.input("local", mssql.NVarChar, local);
    request.input("local2", mssql.NVarChar, local2);

    const result = await request.query(query);
    const totalLocales = result.recordset[0].SrvSupermicro_Total;

    console.log(result.recordset[0]);

    res.json(totalLocales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el total de Minipc" });
  }
});

module.exports = app;
/*app.listen(3006, () => {
  console.log("Corriendo en el puerto 3006");
});*/
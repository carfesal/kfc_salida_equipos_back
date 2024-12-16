require('dotenv').config();
const express = require("express");
const app = express();
//const mssql = require("mssql");
const cors = require("cors");
const bodyParser = require('body-parser');
const settings = require('./src/config/app');
const database = require('./src/database/index');
const router = require('./src/routes/index');

app.use(cors());
app.use(express.json());

// // Configuración de la conexión a la base de datos
database.authenticate().then(() => console.log("Database connected successfully")).catch(err => console.error('Error al conectar con el servidor SQL Server:', err));

//app.use('/', (req, res) => {res.send('Hola desde la ruta Inicial')});
app.use('/salida_equipos/v1/equipos', router.equiposRouter);
app.use('/salida_equipos/v1/usuarios', router.usuariosRouter);

// // Ruta para manejar la solicitud POST
// // INSERTAR ACTIVO FIJO
// app.post("/insertActivoFijo", async (req, res) => {
//   const { campo1,campo2,campo3,campo4,campo5,campo6 } = req.body;

//   // Verificar si campo1 y campo2 están presentes en el cuerpo de la solicitud
//   if (!campo1 || !campo2 || !campo3 || !campo4 || !campo5 || !campo6) {
//     return res.status(400).send("Los campos campo1 y campo2 son requeridos");
//   }

//   try {
//     // Obtener una nueva solicitud del grupo de conexiones (pool)
//     const request = await pool.request();

//     // Establecer los parámetros de entrada
//     request.input("campo1", mssql.NVarChar, campo1);
//     request.input("campo2", mssql.Int, campo2);
//     request.input("campo3", mssql.NVarChar, campo3);
//     request.input("campo4", mssql.NVarChar, campo4);
//     request.input("campo5", mssql.NVarChar, campo5);
//     request.input("campo6", mssql.NVarChar, campo6);

//     // Ejecutar la consulta INSERTAR
//     await request.query(
//       "INSERT INTO ACTIVO_FIJO (CODIGO_AF, ID_PC, FECHAINSTALL_AF, FECHABAJA_AF, ESTADO_AF, DESCRIP_AF) VALUES (@campo1, @campo2, @campo3, @campo4, @campo5,@campo6);"
//     );      

//     res.send("ACTIVO REGISTRADO CON ÉXITO!!!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error al registrar el Activo");
//   }
// }); 

// // CONSULTAR Y FILTRAR TABLA
// app.get("/filtro", async (req, res) => {
//   const { nombre } = req.query;

//   try {
//     // Obtener una nueva solicitud del grupo de conexiones (pool)
//     const request = await pool.request();

//     let query = "SELECT TOP 15 PC.ID_PC,STORE.DESCRIP_ST,STORE.NOMBRE_ST,PC.IP_PC,PC.NOMBRE_PC,PC.DOMINIO_PC,PC.MODELO_PC FROM PC,STORE";

//     // Verificar si se proporcionó un nombre para filtrar
//     if (nombre) {
//       query += " WHERE NOMBRE_ST LIKE @nombre";
//       request.input("nombre", mssql.NVarChar, `%${nombre}%`);
//     }

//     // Ejecutar la consulta SQL
//     const result = await request.query(query);

//     // Enviar los datos como respuesta
//     res.json(result.recordset);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener los datos de la tabla" });
//   }
// });

// //FILTRAR EN COMBOBOX
// // CONSULTAR Y FILTRAR
// app.get("/comboSTORE", async (req, res) => {
//   try {
//     // Obtener una nueva solicitud del grupo de conexiones (pool)
//     const request = await pool.request();

//     // Consulta SQL para obtener solo los nombres de la columna NOMBRE_ST
//     const query = "SELECT STORE.NOMBRE_ST FROM STORE";

//     // Ejecutar la consulta SQL
//     const result = await request.query(query);

//     // Mapear los resultados para extraer solo los nombres
//     const nombres = result.recordset.map(row => row.NOMBRE_ST);

//     // Enviar los nombres como respuesta
//     res.json(nombres);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener los datos de la tabla" });
//   }
// });

// // COMBOBOX FILTRAR PC POR LOCAL
// app.get("/comboPC", async (req, res) => {
//   const { local } = req.query;

//   try {
//     // Obtener una nueva solicitud del grupo de conexiones (pool)
//     const request = await pool.request();

//     // Consulta SQL para obtener solo los nombres de la columna NOMBRE_ST
//     const query = "SELECT PC.ID_PC ,STORE.NOMBRE_ST, PC.NOMBRE_PC, PC.SERIE_PC FROM dbo.STORE INNER JOIN dbo.PC ON dbo.STORE.ID_ST = dbo.PC.ID_ST WHERE dbo.STORE.NOMBRE_ST= @local";

//     // Establecer el parámetro del local seleccionado
//     request.input("local", mssql.NVarChar, local);

//     const result = await request.query(query);
//     const nombres = result.recordset.map(row => row.NOMBRE_PC);

//     // Enviar los nombres como respuesta
//     res.json(nombres);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener los datos de la tabla" });
//   }
// });

// // COMBOBOX FILTRAR PC INDIVIDUAL
// app.get("/idPC", async (req, res) => {
//   const { pc } = req.query;

//   try {
//     // Obtener una nueva solicitud del grupo de conexiones (pool)
//     const request = await pool.request();

//     // Consulta SQL para obtener el ID_PC filtrando por el nombre del PC
//     const query = "SELECT PC.ID_PC, PC.NOMBRE_PC, PC.SERIE_PC FROM dbo.PC WHERE dbo.PC.NOMBRE_PC = @pc";

//     // Establecer el parámetro del nombre del PC
//     request.input("pc", mssql.NVarChar, pc); 

//     // Ejecutar la consulta SQL
//     const result = await request.query(query);
    
//     // Verificar si se encontraron resultados
//     if (result.recordset.length > 0) {
//       // Obtener el primer ID_PC de los resultados
//       const idPC = result.recordset[0].ID_PC;
//       // Enviar el ID_PC como respuesta
//       res.json(idPC);
//     } else {
//       // Si no se encontraron resultados, enviar un mensaje de error
//       res.status(404).json({ message: "No se encontró ningún PC con el nombre proporcionado" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener los datos de la tabla" });
//   }
// });

// // FILTRAR SERIE_PC
// app.get("/seriePC", async (req, res) => {
//   const { pc } = req.query;

//   try {
//     // Obtener una nueva solicitud del grupo de conexiones (pool)
//     const request = await pool.request();

//     // Consulta SQL para obtener el ID_PC filtrando por el nombre del PC
//     const query = "SELECT PC.SERIE_PC FROM dbo.PC WHERE dbo.PC.NOMBRE_PC = @pc";

//     // Establecer el parámetro del nombre del PC
//     request.input("pc", mssql.NVarChar, pc); 

//     // Ejecutar la consulta SQL
//     const result = await request.query(query);
    
//     // Verificar si se encontraron resultados
//     if (result.recordset.length > 0) {
//       // Obtener el primer SERIE_PC de los resultados
//       const seriePC = result.recordset[0].SERIE_PC;
//       // Enviar el ID_PC como respuesta
//       res.json(seriePC);
//     } else {
//       // Si no se encontraron resultados, enviar un mensaje de error
//       res.status(404).json({ message: "No se encontró ninguna serie del pc con el nombre proporcionado" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al obtener los datos de la tabla" });
//   }
// });


app.listen(settings.port, () => {
  console.log(`Corriendo en el puerto ${settings.port}`);
});
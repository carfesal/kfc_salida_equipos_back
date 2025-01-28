const express = require("express");
const mssql = require("mssql");
const cors = require("cors");
const bodyParser = require('body-parser');

const multer = require('multer');

// Configura el almacenamiento para multer
const storage = multer.memoryStorage(); // Almacena archivos en memoria
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
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
const poolPromise = new mssql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conexión exitosa al servidor SQL Server');
        return pool;
    })
    .catch(err => console.error('Error al conectar con el servidor SQL Server:', err));


    app.post("/insertarSalida", async (req, res) => {
        try {
            const { 
                cedulaResponsable, nombresResponsable, apellidosResponsable, celularResponsable,
                nombresAutoriza, apellidosAutoriza, celularAutoriza, motivoSalida, fechaHoraSalida,fechaSalida 
            } = req.body;
            
            //const imagenesFotos = req.files ? req.files.map(file => file.buffer) : [];
            //console.log(imagenesFotos);
            console.log(fechaHoraSalida);
            const pool = await poolPromise;
            const result = await pool.request()
                .input("cedulaResponsable", mssql.NVarChar(11), cedulaResponsable)
                .input("nombresResponsable", mssql.NVarChar(50), nombresResponsable)
                .input("apellidosResponsable", mssql.NVarChar(50), apellidosResponsable)
                .input("celularResponsable", mssql.NVarChar(15), celularResponsable)
                .input("nombresAutoriza", mssql.NVarChar(50), nombresAutoriza)
                .input("apellidosAutoriza", mssql.NVarChar(50), apellidosAutoriza)
                .input("celularAutoriza", mssql.NVarChar(15), celularAutoriza)
                .input("motivoSalida", mssql.NVarChar(mssql.MAX), motivoSalida)
                .input("fechaHoraSalida", mssql.NVarChar(50), fechaHoraSalida)
                .input("fechaSalida", mssql.DateTime, fechaSalida)
                .output("idSalida", mssql.Int)
                .execute("InsertarSalida");
            
            const idSalida = result.output.idSalida;
            console.log('ID de salida generado:', idSalida); // Añadido para depuración
    
            
    
            res.status(200).json({ idSalida });
        } catch (err) {
            console.error("Error al insertar en SALIDA o FOTO", err);
            res.status(500).send("Error en el servidor");
        }
    });
    
    app.post("/insertarSalidaEquipoDetalle", async (req, res) => {
        try {
            const { idSalida, nombreEquipo, marcaEquipo, modeloEquipo, serieEquipo, descripcionEquipo, nombreDestino, cantidad } = req.body;
    
            const pool = await poolPromise;
            await pool.request()
                .input("idSalida", mssql.Int, idSalida)
                .input("nombreEquipo", mssql.NVarChar(50), nombreEquipo)
                .input("marcaEquipo", mssql.NVarChar(50), marcaEquipo)
                .input("modeloEquipo", mssql.NVarChar(50), modeloEquipo)
                .input("serieEquipo", mssql.NVarChar(50), serieEquipo)
                .input("descripcionEquipo", mssql.NVarChar(250), descripcionEquipo)
                .input("nombreDestino", mssql.NVarChar(50), nombreDestino)  // Cambiado de idDestino a nombreDestino
                .input("cantidad", mssql.Int, cantidad)
                .execute("InsertarSalidaEquipoDetalle");
                console.log(idSalida);
            res.status(200).send("Detalles de equipo insertados correctamente");
        } catch (err) {
            console.error("Error al insertar en SALIDA_EQUIPO_DETALLE", err);
            res.status(500).send("Error en el servidor");
        }
    });
    
    
    app.post("/insertarFoto", upload.array('imagenesFotos', 10), async (req, res) => {
        try {
          const { idSalida } = req.body;
          const imagenesFotos = req.files ? req.files.map(file => file.buffer) : [];
      
          if (imagenesFotos.length === 0) {
            return res.status(400).send("No se han enviado imágenes.");
          }
      
          const pool = await poolPromise;
      
          // Insertar cada imagen en la base de datos
          for (const imagenFoto of imagenesFotos) {
            await pool.request()
              .input("idSalida", mssql.Int, idSalida)
              .input("imagenFoto", mssql.VarBinary(mssql.Max), imagenFoto)
              .execute("InsertarFoto");
          }
      
          res.status(200).send("Fotos insertadas correctamente");
        } catch (err) {
          console.error("Error al insertar en FOTO", err);
          res.status(500).send("Error en el servidor");
        }
      });


      app.post("/obtenerResponsable", async (req, res) => {
        const { cedula } = req.body;
      
        try {
          const pool = await poolPromise;
          const request = pool.request();
          // Ajusta la consulta SQL según los nombres de las columnas en tu base de datos
          const query = "SELECT NOMBRES_RESPONSABLE, APELLIDOS_RESPONSABLE, CELULAR_RESPONSABLE FROM RESPONSABLE WHERE CEDULA_RESPONSABLE = @cedula";
          request.input("cedula", mssql.VarChar, cedula); // Cambia el tipo de datos si es necesario
          const result = await request.query(query);
      
          if (result.recordset.length > 0) {
            const responsable = result.recordset[0]; // Suponiendo que la cédula es única
            res.status(200).send({
              nombres: responsable.NOMBRES_RESPONSABLE,
              apellidos: responsable.APELLIDOS_RESPONSABLE,
              telefono: responsable.CELULAR_RESPONSABLE
            });
          } else {
            res.status(404).send({ message: 'Responsable no encontrado' });
          }
        } catch (err) {
          console.error(err);
          res.status(500).send({ message: 'Error interno del servidor' });
        }
      });
      
      module.exports = app;

/*app.listen(3015, () => {
    console.log("Servidor corriendo en el puerto 3015");
});*/

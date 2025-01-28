const express = require("express");
const app = express();
const mssql = require("mssql");
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const ExcelJS = require('exceljs'); // Importar exceljs

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
const pool = new mssql.ConnectionPool(config);

// Conectar el pool a la base de datos
pool.connect()
  .then(() => console.log('Conexión exitosa al servidor SQL Server'))
  .catch(err => console.error('Error al conectar con el servidor SQL Server:', err));

// Configuración de para GMAIL
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'erwin1000cj@gmail.com', // Tu correo
    pass: 'mwoc ixml hrfa icbs', // Tu contraseña de correo
  },
});

// CORREOS POR OFFICE 365
/*const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true para el puerto 465, false para el puerto 587
  auth: {
    user: 'seguridad.fisicagye@kfc.com.ec',
    pass: 'nxhlqdtxkkydyhhn',
  },
  tls: {
    rejectUnauthorized: false, // Puede ser necesario en algunos entornos, pero asegúrate de que tu conexión es segura
  },
});

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "seguridad.fisicagye@kfc.com.ec", // Tu correo
    pass: "nxhlqdtxkkydyhhn", // Tu contraseña de correo
  },
  logger: true,
  debug: true, // Agrega esta línea para habilitar la depuración
});*/



// Función para obtener los registros de la base de datos
async function getRecords() {
  try {
    const request = pool.request();
    const result = await request.query('SELECT * FROM dbo.fn_ReporteSalidaDiaAnterior();');
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener los registros:', error);
  }
}

// Función para enviar el correo con el reporte en formato de tabla HTML y adjuntar un archivo Excel
async function sendEmailAsHtmlAndExcel(records) {
  const tableRows = records.map(record => `
    <tr>
      <td>${record.ID_SALIDA}</td>
      <td>${record.FECHA_HORA_SALIDA}</td>
      <td>${record.CEDULA_RESPONSABLE}</td>
      <td>${record.NOMBRES_RESPONSABLE} ${record.APELLIDOS_RESPONSABLE}</td>
      <td>${record.NOMBRE_EQUIPO}</td>
      <td>${record.MARCA_EQUIPO}</td>
      <td>${record.MODELO_EQUIPO}</td>
      <td>${record.SERIE_EQUIPO}</td>
      <td>${record.DESCRIPCION_EQUIPO}</td>
      <td>${record.CANTIDAD}</td>
      <td>${record.NOMBRE_DESTINO}</td>
      <td>${record.MOTIVO_SALIDA}</td>
      <td>${record.NOMBRES_AUTORIZA}</td>
      <td>${record.APELLIDOS_AUTORIZA}</td>
      <td>${record.CELULAR_AUTORIZA}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <h3>Aquí tienes los registros del día de ayer:</h3>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>ID SALIDA</th>
          <th>FECHA HORA SALIDA</th>
          <th>CÉDULA RESPONSABLE</th>
          <th>NOMBRES RESPONSABLE</th>
          <th>NOMBRE EQUIPO</th>
          <th>MARCA EQUIPO</th>
          <th>MODELO EQUIPO</th>
          <th>SERIE EQUIPO</th>
          <th>DESCRIPCIÓN EQUIPO</th>
          <th>CANTIDAD</th>
          <th>NOMBRE DESTINO</th>
          <th>MOTIVO SALIDA</th>
          <th>NOMBRES AUTORIZA</th>
          <th>APELLIDOS AUTORIZA</th>
          <th>CELULAR AUTORIZA</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  // Crear archivo Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  worksheet.columns = [
    { header: 'ID SALIDA', key: 'ID_SALIDA' },
    { header: 'FECHA HORA SALIDA', key: 'FECHA_HORA_SALIDA' },
    { header: 'CÉDULA RESPONSABLE', key: 'CEDULA_RESPONSABLE' },
    { header: 'NOMBRES RESPONSABLE', key: 'NOMBRES_RESPONSABLE' },
    { header: 'NOMBRE EQUIPO', key: 'NOMBRE_EQUIPO' },
    { header: 'MARCA EQUIPO', key: 'MARCA_EQUIPO' },
    { header: 'MODELO EQUIPO', key: 'MODELO_EQUIPO' },
    { header: 'SERIE EQUIPO', key: 'SERIE_EQUIPO' },
    { header: 'DESCRIPCIÓN EQUIPO', key: 'DESCRIPCION_EQUIPO' },
    { header: 'CANTIDAD', key: 'CANTIDAD' },
    { header: 'NOMBRE DESTINO', key: 'NOMBRE_DESTINO' },
    { header: 'MOTIVO SALIDA', key: 'MOTIVO_SALIDA' },
    { header: 'NOMBRES AUTORIZA', key: 'NOMBRES_AUTORIZA' },
    { header: 'APELLIDOS AUTORIZA', key: 'APELLIDOS_AUTORIZA' },
    { header: 'CELULAR AUTORIZA', key: 'CELULAR_AUTORIZA' },
  ];

  records.forEach(record => {
    worksheet.addRow({
      ID_SALIDA: record.ID_SALIDA,
      FECHA_HORA_SALIDA: record.FECHA_HORA_SALIDA,
      CEDULA_RESPONSABLE: record.CEDULA_RESPONSABLE,
      NOMBRES_RESPONSABLE: record.NOMBRES_RESPONSABLE,
      NOMBRE_EQUIPO: record.NOMBRE_EQUIPO,
      MARCA_EQUIPO: record.MARCA_EQUIPO,
      MODELO_EQUIPO: record.MODELO_EQUIPO,
      SERIE_EQUIPO: record.SERIE_EQUIPO,
      DESCRIPCION_EQUIPO: record.DESCRIPCION_EQUIPO,
      CANTIDAD: record.CANTIDAD,
      NOMBRE_DESTINO: record.NOMBRE_DESTINO,
      MOTIVO_SALIDA: record.MOTIVO_SALIDA,
      NOMBRES_AUTORIZA: record.NOMBRES_AUTORIZA,
      APELLIDOS_AUTORIZA: record.APELLIDOS_AUTORIZA,
      CELULAR_AUTORIZA: record.CELULAR_AUTORIZA,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const mailOptions = {
    from: 'erwin1000cj@gmail.com',
    to: 'griselda.orellana@kfc.com.ec,oscar.castro@kfc.com.ec,david.rodriguez@kfc.com.ec',
    cc: 'seguridad.fisicagye@kfc.com.ec,jose.pirela@kfc.com.ec',
    subject: 'REPORTE-SALIDA DE EQUIPOS DEL DÍA ANTERIOR',
    html: htmlContent, // Usar el contenido HTML
    attachments: [
      {
        filename: 'reporte_salidaEquipos.xlsx',
        content: buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

// Tarea programada para las 00:00 (puedes ajustarla según tu necesidad)
cron.schedule('0 8 * * *', async () => { // Ajusta el cron según tus necesidades
  const records = await getRecords();
  if (records && records.length > 0) {
    await sendEmailAsHtmlAndExcel(records);
  } else {
    console.log('No hay registros para enviar.');
  }
});
module.exports = app;
// Iniciar el servidor
/*app.listen(3016, () => {
  console.log("Corriendo en el puerto 3016");
});*/

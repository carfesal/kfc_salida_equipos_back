const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail'); // Importar configuración de correo
const moment = require('moment');


// PROJECT DEPENDENCIES
const sequelize = require('../database');
const SendMail = require('../utils/send_mail');

const mailer = new SendMail();

const HEADERS_LABELS = {
    idSalida: "ID Salida",
    fechaHoraSalida: "Fecha y hora de salida",
    motivoSalida: "Motivo de salida",
    estado: "Estado Salida",
    autorizadorNombre: "Nombre del autorizador",
    autorizadorCedula: "Cédula del autorizador",
    autorizadorTelefono: "Teléfono del autorizador",
    responsableNombre: "Nombre del responsable",
    responsableCedula: "Cédula del responsable",
    equipoNombre: "Nombre del equipo",
    equipoDescripcion: "Descripción del equipo",
    equipoMarca: "Marca del equipo",
    equipoModelo: "Modelo del equipo",
    equipoSerie: "Serie del equipo",
    lugarNombre: "Nombre del lugar",
    lugarDireccion: "Dirección del lugar"
};

/**
 * 
 * @param {*} records 
 * @returns 
 */
const buildHtmlContent = (records) => {
    let htmlContent = `
        <h3>Aquí tienes los registros del día de ayer:</h3>
        <table border="1" cellpadding="5" cellspacing="0">
            <thead>
                <tr>
    `;

    htmlContent = htmlContent.concat(Object.keys(HEADERS_LABELS).map(key => `<th>${key}</th>`).join(''), '</tr></thead><tbody>');

    htmlContent = htmlContent.concat(records.map(record => `
        <tr>
            ${Object.keys(HEADERS_LABELS).map(key => `<td>${record[key]}</td>`).join('')}
        </tr>
    `).join(''), '</tbody></table>');

    return htmlContent;
}

/**
 * 
 * @param {*} records 
 * @returns Promise<ExcelJS.Buffer>
 */
const buildExcelFile = async (records) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    worksheet.columns = Object.keys(HEADERS_LABELS).map(key => ({ header: HEADERS_LABELS[key], key }));

    // records.forEach(record => {
    //     worksheet.addRow(record);
    // });

    worksheet.addRows(records);

    return await workbook.xlsx.writeBuffer();
};

const buildRecordsQuery = (fecha_desde, fecha_hasta) => {
    return `
        SELECT 
            s.id AS idSalida,
            s.fechaHoraSalida,
            s.motivoSalida,
            s.estado,
            aut.nombre AS autorizadorNombre,
            aut.cedula AS autorizadorCedula,
            aut.telefono AS autorizadorTelefono,
            res.nombre AS responsableNombre,
            res.cedula AS responsableCedula,
            e.nombre AS equipoNombre,
            e.descripcion AS equipoDescripcion,
            e.marca AS equipoMarca,
            e.modelo AS equipoModelo,
            e.serie AS equipoSerie,
            l.nombre AS lugarNombre,
            l.direccion AS lugarDireccion 
        FROM Salida s 
        INNER JOIN SalidaDetalle sd ON s.id = sd.salidaId
        INNER JOIN Equipo e ON sd.equipoId = e.id
        LEFT JOIN Lugar l ON sd.destinoId = l.id
        LEFT JOIN Usuario aut ON s.autorizadorId = aut.id
        INNER JOIN Usuario res ON s.responsableId = res.id
        WHERE s.fechaHoraSalida >= '${fecha_desde}' AND s.fechaHoraSalida < '${fecha_hasta}'
    `;
}

/**
 * 
 * @param {*} fecha_desde 
 * @param {*} fecha_hasta 
 * @returns 
 */
const obtenerRecordsDeSalidas = async (fecha_desde, fecha_hasta) => {
   let [records, metadata] = await sequelize.query(buildRecordsQuery(fecha_desde, fecha_hasta));

   if (!records || records.length === 0) {
       return [];
   }

    return records;
};


module.exports.ejecutarReporteSalida = async () => {
    const fechaHasta = moment();
    const fechaDesde = moment().subtract(1, 'days');

    console.log(`Generando reporte de salidas desde ${fechaDesde.format('YYYY-MM-DD')} hasta ${fechaHasta.format('YYYY-MM-DD')}`);

    const records = await obtenerRecordsDeSalidas(fechaDesde.format('YYYY-MM-DD'), fechaHasta.format('YYYY-MM-DD'));

    if (!records || records.length === 0) {
        console.log('No hay registros para enviar');
        return;
    }

    const htmlContent = buildHtmlContent(records);
    const excelBuffer = await buildExcelFile(records);

    await mailer.sendMail(
        'griselda.orellana@kfc.com.ec,oscar.castro@kfc.com.ec,david.rodriguez@kfc.com.ec',
        'REPORTE-SALIDA DE EQUIPOS DEL DÍA ANTERIOR',
        'seguridad.fisicagye@kfc.com.ec,jose.pirela@kfc.com.ec',
        htmlContent,
        [{ filename: 'reporte_salidas.xlsx', content: excelBuffer, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }]
    );
};


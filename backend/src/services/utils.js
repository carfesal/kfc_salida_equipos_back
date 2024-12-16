/**
 * 
 * @param { string } mensaje 
 * @param { object } datos 
 * @param { number } codigo 
 * @param { boolean } exito 
 * @returns 
 */
const crearRespuesta = (mensaje, datos, codigo, exito = false) => {
    return {
        mensaje,
        datos,
        codigo,
        exito
    }
}

module.exports = {
    crearRespuesta
}   
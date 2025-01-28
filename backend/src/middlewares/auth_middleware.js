const jwt = require('jsonwebtoken');
const appConfig = require('../config/app');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ mensaje: "No se proporcionó un token" });
    }

    jwt.verify(token, appConfig.jwtSecret, (error, decoded) => {
        if (error) {
            return res.status(422).json({ mensaje: "No autorizado", error: error });
        }
        req.usuario = decoded;
        next();
    });
};

module.exports = {
    verifyToken
}
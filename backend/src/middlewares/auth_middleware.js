const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['Authorization'];

    if (!token) {
        return res.status(403).json({ mensaje: "No se proporcionó un token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ mensaje: "No autorizado" });
        }

        req.usuario = decoded;
        next();
    });
};
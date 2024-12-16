const z = require('zod');

const validateRequest = (schema) => {
    return (req, res, next) => {
        try {            
            let data = schema.parse(req.body);
            req.body = data;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ mensaje: "Data incompleta o erronea!", error: error.errors });
            }
            res.status(400).json({ error: error.errors });
        }
    };
}

module.exports = validateRequest;
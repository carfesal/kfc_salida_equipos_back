require('dotenv').config();

module.exports = {
    port: process.env.APP_PORT ?? 3000,
    jwtSecret: process.env.JWT_SECRET ?? 'b3b86e8dc0c54bf7950ea255556ae80fc5c8a63710c5080d35719e6f10505fc7',
}
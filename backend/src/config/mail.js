require('dotenv').config();

module.exports = {
    host: process.env.MAIL_HOST ?? 'smtp.mailtrap.io',
    port: process.env.MAIL_PORT ?? 2525,
    user: process.env.MAIL_USERNAME ?? 'b3b86e8dc0c54bf7950ea255556ae80fc5c8a63710c5080d35719e6f10505fc7',
    pass: process.env.MAIL_PASSWORD ?? 'b3b86e8dc0c54bf7950ea255556ae80fc5c8a63710c5080d35719e6f10505fc7',
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL ?? 'test@test.com',
}
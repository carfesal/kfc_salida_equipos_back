const mailConfig = require('../config/mail');
const nodemailer = require('nodemailer');

class SendMail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: mailConfig.host,
            port: mailConfig.port,
            secure: false,
            auth: {
                user: mailConfig.user,
                pass: mailConfig.pass,
            },
        });
    }

    /**
     * 
     * @param {*} to 
     * @param {*} subject 
     * @param {*} cc 
     * @param {*} html 
     * @param {*} attachments 
     */
    async sendMail(to, subject, cc, html, attachments = []) {
        try {
            const mailOptions = {
                from: mailConfig.user,
                to,
                cc,
                subject,
                html
            };

            if (attachments.length > 0) 
                mailOptions.attachments = attachments;

            await this.transporter.sendMail(mailOptions);
            console.log('Mail sent successfully');
        } catch (error) {
            console.error('Error sending mail: ', error);
        }
    }

    /**
     * 
     * @param {*} filename 
     * @param {*} content 
     * @param {*} contentType 
     * @returns 
     */
    static async buildAttachment(filename, content, contentType) {
        return {
            filename,
            content,
            contentType
        };
    }
}

module.exports = SendMail;
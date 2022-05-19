const nodeMailer = require("nodemailer")

class EmailService {

    constructor(){
        this.transporter = nodeMailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationLink(to, link){
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:'активация аккаунта' + process.env.API_URL,
            text:"",
            html:
            `<div>
                <h1>Для активации переидите по ссилке</h1>
                <a href=${link}>${link}</a>
            </div>
            `
        })
    }
}

module.exports = new EmailService()
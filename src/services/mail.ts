import { Transporter } from "nodemailer";
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import { DataForgotPassword, IEmailService } from "./interfaces";
import ForgotPasswordPage from "@/resources/views/mails/pages/forgot-password";

export type Email = string

export default class EmailService implements IEmailService {
    constructor(
        private transporter: Transporter<SMTPTransport.SentMessageInfo>
    ) {}


    sendForgotPassword(to: Email[], data: DataForgotPassword) {
        return this.transporter.sendMail({
            from: 'Votting ID <no-reply@votting.id>',
            to: to.join(','),
            subject: 'Forgot Password',
            // html: `Hai kamu, kami menerima permintaan reset password. Password baru kamu adalah: ${newPassword}\nGunakan password ini untuk login dan segera ganti password kamu\n Terima Kasih`,
            html: ForgotPasswordPage({
                name: data.name,
                password: data.password
            }).toString()
        })
    }

}
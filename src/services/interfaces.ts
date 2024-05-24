import SMTPTransport = require("nodemailer/lib/smtp-transport");
import { Email } from "./mail";

export type DataForgotPassword = {
    name: string
    password: string
}
export interface IEmailService {
    sendForgotPassword(to: Email[], data: DataForgotPassword): Promise<SMTPTransport.SentMessageInfo>
}
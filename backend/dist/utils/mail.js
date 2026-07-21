import nodemailer from "nodemailer";
import env from "../config/env";
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});
export const sendMail = async (mail) => {
    await transporter.sendMail({
        from: env.SMTP_FROM,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
    });
};

import nodemailer from "nodemailer";
import env from "~/config/env.ts";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

interface IMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async (mail: IMailOptions): Promise<void> => {
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
  });
};
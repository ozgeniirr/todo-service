import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import StreamTransport from 'nodemailer/lib/stream-transport';

type AnySent = SMTPTransport.SentMessageInfo | StreamTransport.SentMessageInfo;
type AnyTransporter = Transporter<AnySent>;

let transporter: AnyTransporter | undefined;

function createTransporter(): AnyTransporter {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;


  if (!host || !user || !pass) {
    const t = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    } as StreamTransport.Options);
    return t;
  }


  const t = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  } as SMTPTransport.Options);
  return t;
}

export function getTransporter(): AnyTransporter {
  if (!transporter) transporter = createTransporter();
  return transporter!;
}


export async function sendMailSimple(to: string, subject: string, text: string, html?: string) {
  const info = await getTransporter().sendMail({
    from: process.env.SMTP_FROM || 'Mail Service <noreply@example.com>',
    to,
    subject,
    text,
    html,
  });
  return info;
}

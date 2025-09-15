import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer'
import { logger } from '../logger/logger';

type AnyTx = Transporter<SentMessageInfo>
let tx: AnyTx | undefined

function createTx(): AnyTx {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    } as any)
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  } as any)
}

export function getTransporter() {
  if (!tx) tx = createTx()
  return tx
}

export async function sendMailSimple(to: string, subject: string, text: string, html?: string) {
  const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || '' 
  const info = await getTransporter().sendMail({
    from: fromAddr,
    to,
    subject,
    text,
    html,
  })
  return info
}

  
  export async function verifyTransport() {
    const tx = getTransporter();
    try {
      const ok = await tx.verify();
      logger.info('smtp.verify.ok', { ok, host: process.env.SMTP_HOST, port: process.env.SMTP_PORT });
    } catch (e: any) {
    logger.error('smtp.verify.fail', { message: e?.message, host: process.env.SMTP_HOST, port: process.env.SMTP_PORT });
  }
}

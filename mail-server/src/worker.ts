import 'dotenv/config'
import { Worker, QueueEvents } from 'bullmq'
import { sendMailSimple } from './lib/mailer'
import { redisConnection } from './redis/redis'
import { logger } from './logger/logger'
import type { SendMailJob } from './types'
import { verifyTransport } from './lib/mailer'


;(async () => {
    await verifyTransport()    
    const requiredVars = [
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS",
      "REDIS_HOST",
    ];

    const missing = requiredVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      logger.error(`Missing environment variables: ${missing.join(", ")}`);
      process.exit(1);
}
  const worker = new Worker<SendMailJob>(
    'mail',
    async (job) => {
      const { to, subject, text, html } = job.data
      const info = await sendMailSimple(to, subject, text || '', html)
      logger.info('mail.sent', {
        to,
        messageId: (info as any).messageId,
        response:  (info as any).response,  
        accepted:  (info as any).accepted,   
        rejected:  (info as any).rejected,  
        envelope:  (info as any).envelope,
      })
          return { deliveredTo: to }
},
    { connection: redisConnection, concurrency: 5 }
  )

  const events = new QueueEvents('mail', { connection: redisConnection })
  events.on('completed', ({ jobId }) => logger.info('job.completed', { jobId }))
  events.on('failed', ({ jobId, failedReason }) => logger.error('job.failed', { jobId, failedReason }))
  worker.on('error', (err) => logger.error('worker.error', { message: err.message }))

  logger.info('Mail worker started.')

  



})()




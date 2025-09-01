
import 'dotenv/config';
import { Worker, QueueEvents } from 'bullmq';
import { sendMailSimple } from '@/lib/mailer';
import type { SendMailJob } from '@/jobs/queue';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null as null, 
  enableReadyCheck: true,
};

(async () => {
  const worker = new Worker<SendMailJob>(
    'mail',
    async (job) => {
      const { to, subject, text, html } = job.data;
      const info = await sendMailSimple(to, subject, text || '', html);
      console.log('Mail gönderildi:', to, 'messageId:', (info as any).messageId);
      return { deliveredTo: to };
    },
    { connection, concurrency: 5 }
  );

  const events = new QueueEvents('mail', { connection });

  events.on('completed', ({ jobId }) => console.log('Job completed:', jobId));
  events.on('failed', ({ jobId, failedReason }) => console.error('Job failed:', jobId, failedReason));

  worker.on('error', (err) => console.error('Worker error:', err));
  console.log('📨 Mail worker started.');
})();

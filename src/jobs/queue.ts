import { Queue } from 'bullmq';

export type SendMailJob = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null as null,
  enableReadyCheck: true,
};

export const mailQueue = new Queue<SendMailJob>('mail', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

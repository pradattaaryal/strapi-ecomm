import { Queue, JobsOptions } from 'bullmq';
import { queueManager } from '../../index';
import { MAIL_QUEUE, MAIL_JOB_NAMES } from './constants';
import { IMailPayload, IBulkMailPayload } from './interfaces';
import { DEFAULT_JOB_OPTIONS } from '../../config';

export class MailQueueProducer {
  private queue: Queue;

  constructor() {
    this.queue = queueManager.createQueue(MAIL_QUEUE);
  }

  async sendMail(data: IMailPayload, options?: JobsOptions) {
    return this.queue.add(MAIL_JOB_NAMES.SEND, data, {
      ...DEFAULT_JOB_OPTIONS,
      priority: 2,
      ...options,
    });
  }

  async sendBulkMail(data: IBulkMailPayload, options?: JobsOptions) {
    return this.queue.add(MAIL_JOB_NAMES.SEND_BULK, data, {
      ...DEFAULT_JOB_OPTIONS,
      priority: 3,
      ...options,
    });
  }
}

export const mailQueueProducer = new MailQueueProducer();
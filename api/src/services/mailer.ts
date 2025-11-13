import { mailQueueProducer } from '../extensions/queue/queues/mail/producer';
import { IMailPayload, IBulkMailPayload } from '../extensions/queue/queues/mail/interfaces';

export const mailerService = {
  async queueSingleMail(data: IMailPayload) {
    console.log('[MailerService] Queuing single mail job');
    return mailQueueProducer.sendMail(data);
  },

  async queueBulkMail(data: IBulkMailPayload) {
    console.log('[MailerService] Queuing bulk mail job');
    return mailQueueProducer.sendBulkMail(data);
  },
};

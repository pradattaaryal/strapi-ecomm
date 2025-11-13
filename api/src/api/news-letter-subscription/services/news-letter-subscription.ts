import { factories } from '@strapi/strapi';
import { queueManager } from '../../../extensions/queue';
import { MAIL_QUEUE, MAIL_JOB_NAMES } from '../../../extensions/queue/queues/mail/constants';

export default factories.createCoreService('api::news-letter-subscription.news-letter-subscription', ({ strapi }) => ({
  
  async queueNewsletter({ subject, htmlContent, templateId, templateName }) {
    // Fetch all subscribed users
    const subscribers = await strapi.db.query('api::news-letter-subscription.news-letter-subscription').findMany({
      select: ['email'],
      where: { isSubscribed: true,publishedAt: { $notNull: true } },
    });

    if (!subscribers.length) {
      strapi.log.warn('[NewsletterService] No subscribed users found.');
      return {
        success: false,
        message: 'No subscribed users found',
        queuedCount: 0,
        batchesQueued: 0
      };
    }

    // Get or create the mail queue
    const queue = queueManager.getQueue(MAIL_QUEUE) || queueManager.createQueue(MAIL_QUEUE);

    // Queue emails in batches of 500
    const chunkSize = 500;
    const batches = [];
    
    for (let i = 0; i < subscribers.length; i += chunkSize) {
      const batch = subscribers.slice(i, i + chunkSize);
      const emails = batch.map((s) => s.email);

      const job = await queue.add(MAIL_JOB_NAMES.SEND_BULK, {
        subject,
        htmlContent,
        emails,
      });

      batches.push({
        jobId: job.id,
        emailCount: emails.length,
        batchNumber: Math.floor(i / chunkSize) + 1
      });
    }

    strapi.log.info(
      `[NewsletterService] Queued ${subscribers.length} recipients in ${batches.length} batch(es) ` +
      `using template: ${templateName || templateId || 'N/A'}`
    );

    return {
      success: true,
      message: 'Newsletter queued successfully',
      totalRecipients: subscribers.length,
      batchesQueued: batches.length,
      batches: batches,
      template: {
        id: templateId,
        name: templateName
      }
    };
  },
}));

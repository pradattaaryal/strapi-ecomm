import axios from 'axios';
import { queueManager } from '../../index';
import { MAIL_QUEUE, MAIL_JOB_NAMES } from './constants';
import { IMailPayload, IBulkMailPayload } from './interfaces';
import { brevoConfig } from '../../../../../config/brevo';

export const registerMailProcessors = () => {
  // SINGLE EMAIL JOB
  queueManager.registerProcessor(
    MAIL_QUEUE,
    MAIL_JOB_NAMES.SEND,
    {
      async process(job) {
        const payload = job.data as IMailPayload;
        strapi.log.info(`[Worker] Processing single email job → To: ${payload.to}, Subject: ${payload.subject}`);
        try {
          const response = await axios.post(
            brevoConfig.apiUrl,
            {
              sender: {
                email: 'webexpertsnepal20@gmail.com', 
                name: 'strapi', 
              },
              to: [{ email: payload.to }],
              subject: payload.subject,
              htmlContent: payload.html || '<h1>No HTML content</h1>',
              textContent: payload.text || 'No text content',
            },
            {
              headers: {
                'api-key': brevoConfig.apiKey,
                'Content-Type': 'application/json',
              },
            }
          );

          strapi.log.info(
            `[Brevo] ✅ Email sent successfully → ${payload.to}, Status: ${response.status}`
          );
        } catch (error: any) {
          strapi.log.info(
            `[Brevo] ❌ Failed to send email to ${payload.to}: ${error.message}`
          );

          if (error.response?.data) {
            strapi.log.info('Response:', JSON.stringify(error.response.data, null, 2));
          }
        }

        strapi.log.info(`[Worker] ✅ Single email job ${job.id} done`);
      },
    },
    3
  );

  // BULK EMAIL JOB
  queueManager.registerProcessor(
    MAIL_QUEUE,
    MAIL_JOB_NAMES.SEND_BULK,
    {
      async process(job) {
        const payload = job.data as { subject: string; htmlContent: string; emails: string[] };
        const { subject, htmlContent, emails } = payload;
        
        strapi.log.info(`[Worker] Processing bulk email job → ${emails.length} recipients, Subject: ${subject}`);
        
        let successCount = 0;
        let failCount = 0;

        // Send emails in parallel batches to avoid overwhelming the API
        const batchSize = 50;
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          
          const emailPromises = batch.map(async (email) => {
            try {
              const response = await axios.post(
                brevoConfig.apiUrl,
                {
                  sender: {
                    email: 'webexpertsnepal20@gmail.com',
                    name: 'strapi',
                  },
                  to: [{ email }],
                  subject,
                  htmlContent: htmlContent || '<h1>No HTML content</h1>',
                  textContent: subject, // Fallback text content
                },
                {
                  headers: {
                    'api-key': brevoConfig.apiKey,
                    'Content-Type': 'application/json',
                  },
                }
              );

              successCount++;
              return { email, success: true, status: response.status };
            } catch (error: any) {
              failCount++;
              strapi.log.warn(
                `[Brevo] ❌ Failed to send email to ${email}: ${error.message}`
              );
              return { email, success: false, error: error.message };
            }
          });

          await Promise.all(emailPromises);
          
          // Small delay between batches to avoid rate limiting
          if (i + batchSize < emails.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        strapi.log.info(
          `[Worker] ✅ Bulk email job ${job.id} completed → Success: ${successCount}, Failed: ${failCount}, Total: ${emails.length}`
        );
      },
    },
    2 // Lower concurrency for bulk jobs to avoid rate limiting
  );
};

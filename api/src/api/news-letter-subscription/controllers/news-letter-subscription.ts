/**
 * news-letter-subscription controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::news-letter-subscription.news-letter-subscription', ({ strapi }) => ({
async sendNewsletter(ctx) {
  const { templateId } = ctx.request.body;


  if (!templateId) {
    return ctx.badRequest(
      'templateId is required. Provide a numeric ID or Strapi documentId string.'
    );
  }

  try {
    // Determine query type
    const isNumericId = /^\d+$/.test(String(templateId));

    // Build query dynamically
    const whereClause = isNumericId
      ? { id: Number(templateId) }
      : { documentId: templateId };

    // Fetch template
    const template = await strapi.db
      .query('api::email-template.email-template')
      .findOne({ where: whereClause });

    if (!template) {
      return ctx.notFound(
        `Email template with id/documentId "${templateId}" not found.`
      );
    }

    // Check published
    const publishedAt = template.publishedAt || (template as any).published_at;
    if (!publishedAt) {
      return ctx.badRequest(
        `Email template "${templateId}" is not published. Please publish it first.`
      );
    }

    // Extract fields safely (handle snake_case and camelCase)
    const subject = template.subject || (template as any).subject;
    const htmlContent = template.htmlContent || (template as any).html_content;
    const name = template.name || (template as any).name;
    const documentId = template.documentId || (template as any).document_id;

    if (!subject || !htmlContent) {
      strapi.log.error('[Newsletter] Template missing required fields', {
        templateId,
        keys: Object.keys(template),
        hasSubject: !!subject,
        hasHtmlContent: !!htmlContent,
      });
      return ctx.badRequest(
        `Email template "${name || templateId}" is missing subject or htmlContent.`
      );
    }

    // Queue newsletter
    const result = await strapi
      .service('api::news-letter-subscription.news-letter-subscription')
      .queueNewsletter({
        subject,
        htmlContent,
        templateId: documentId || templateId,
        templateName: name,
      });

    return ctx.send({
      success: true,
      message: `Newsletter queued for sending using template: "${name || templateId}"`,
      template: {
        id: documentId || templateId,
        name,
        subject,
      },
      ...result,
    });
  } catch (error: any) {
    strapi.log.error('[Newsletter] Error sending newsletter', error);
    return ctx.internalServerError(
      `Failed to send newsletter: ${error.message}`
    );
  }
}

}));

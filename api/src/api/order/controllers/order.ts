import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { products } = ctx.request.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return ctx.badRequest('Products are required');
      }

     
      const session = await strapi
        .service('api::order.order')
        .createCheckoutSession(products);

      return { stripeSession: session };
    } catch (error: any) {
      
      ctx.response.status = 500;
      return { error: error.message || 'Internal server error' };
    }
  },
}));

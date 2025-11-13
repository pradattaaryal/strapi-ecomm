import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async getPopulatedHomePage(ctx) {
    try {
      const populate = {
        blocks: {
          on: {
            'blocks.hero': {
              populate: {
                logo: {
                  populate: '*'
                },
                image: {
                  fields: ['name', 'alternativeText', 'caption', 'width', 'height', 'url', 'mime', 'size']
                },
                cta: {
                  populate: '*'
                }
              }
            },
            'blocks.info-block': {
              populate: {
                image: {
                  fields: ['name', 'alternativeText', 'caption', 'width', 'height', 'url', 'mime', 'size']
                },
                cta: {
                  populate: '*'
                }
              }
            }
          }
        }
      } as any;

      const homePage = await strapi.documents('api::home-page.home-page').findFirst({
        fields: ['id', 'title', 'desc'],
        populate,
      });

      if (!homePage) {
        return ctx.notFound('Home page not found');
      }

      return { data: homePage };
    } catch (error) {
     // strapi.log.error('Error fetching home page data:', error);
      ctx.throw(500, 'Internal Server Error');
    }
  },
}));
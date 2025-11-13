/**
 * product-category router
 */

import { factories } from '@strapi/strapi';
 import xx from './custom-product-category'

const defaultRouter= factories.createCoreRouter('api::product-category.product-category' as any);

const customRouter = (innerRouter: any, extraRoutes: any[] = []) => {
  let routes: any[] | undefined;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

 
export default customRouter(defaultRouter, xx.routes);

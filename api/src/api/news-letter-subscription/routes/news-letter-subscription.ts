/**
 * news-letter-subscription router
 */

import { factories } from '@strapi/strapi';
import customRoutes from './customNewsLetter';
import customRouter from '../../../helper/router.helper';

const defaultRouter = factories.createCoreRouter('api::news-letter-subscription.news-letter-subscription');

export default customRouter(defaultRouter, customRoutes.routes);

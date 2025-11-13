export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
    {
    name: 'global::redis-cache',
    config: {
      ttl: 120,
      prefix: 'cache:',
      includePaths: ['/api/home-page/populated']
    },
  }
];

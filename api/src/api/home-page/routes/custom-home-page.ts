export default {
  routes: [
    {
      method: 'GET',
      path: '/home-page/populated',
      handler: 'home-page.getPopulatedHomePage',
      config: {
        auth: false, 
        middlewares: [
          {
            name: 'global::rate-limit',
            config: {
              windowMs: 60_000,
              max: 10,         
              prefix: 'rl:home-page:',
            },
          },
          {
            name: 'global::redis-cache',
            config: { ttl: 300, prefix: 'product:' },
          },
           { name: 'global::is-authenticated', config: { required: false } }
        ], 
      },
    },
  ],
};

export default {
  routes: [
    {
      method: 'GET',
      path: '/product-categories/key',
      handler: 'product-category.key',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/product-categories/more-stuff',
      handler: 'product-category.moreStuff',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/product-categories/custom-query',
      handler: 'product-category.customQuery',
      config: {
        auth: false,
      },

    },
    {
      method: 'GET',
      path: '/products/:id',
      handler: 'product-category.findOne',
      config: { auth: false },
    },

  ],
};

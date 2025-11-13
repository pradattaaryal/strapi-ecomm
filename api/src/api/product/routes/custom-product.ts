
 

export default {
    routes: [
    {
      method: "GET",
      path: "/products/filter",
      handler: "product.getFilteredProductList",
      config: {
        auth: false,
        // middlewares: [
        //   {
        //     name: 'global::redis-cache',
        //     config: { ttl: 300, prefix: 'cache:' },
        //   },],
      },
    },
    {
      method: "GET",
      path: "/products/:id",
      handler: "product.findOne",
      config: {
        auth: false,  
      },
    },
     {
      method: "GET",
      path: "/products",
      handler: "product.find",
      config: {
        auth: false,  
      },
    },
  ],
};

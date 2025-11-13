export default {
  routes: [
    {
      method: 'POST',
      path: '/orders',
      handler: 'order.create',
      config: {
        auth: false,  
      },
    },
  ],
};
